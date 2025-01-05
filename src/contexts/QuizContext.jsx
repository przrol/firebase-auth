import { createContext, useEffect, useReducer } from "react";
import { arraysContainSameStrings, shuffle, shuffleAnswers } from "../helpers";
import { getExamQuestions, fetchCollectionNames } from "../firebase";

const initialState = {
  questions: [],
  allQuestions: [],
  failedQuestions: [],
  currentQuestionIndex: 0,
  showResults: false,
  correctAnswerCount: 0,
  answers: [],
  currentAnswers: [],
  showExplanation: false,
  solveQuestion: false,
  isDarkMode: localStorage.getItem("theme") === "dark",
  restartOnlyFailed: false,
  showDeleteModalDialog: false,
  imageUrl: "",
  examTopicId: 0,
  currentGroupNumber: localStorage.getItem("currentGroupNumber")
    ? parseInt(localStorage.getItem("currentGroupNumber"))
    : 0,
  examArray: [],
  lastModified: "",
  currentExamNumber: localStorage.getItem("currentExamNumber")
    ? localStorage.getItem("currentExamNumber")
    : "AI-900",
  selectedVoices: window.speechSynthesis
    .getVoices()
    .filter(
      (v) =>
        v.name.startsWith("Microsoft Emma Online") ||
        v.name === "Google US English"
    ),
  voiceRate: 1.1,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_ANSWER": {
      // payload -> "answerText"
      const currentQuestion = state.questions[action.currentQuestionIndex];

      const questionCorrectAnswers =
        currentQuestion.correctAnswers[action.index];

      const currentAnswers = [...state.currentAnswers];
      if (
        questionCorrectAnswers.length === 1 &&
        !currentQuestion.question
          .toLowerCase()
          .includes("select yes if the statement is true")
      ) {
        currentAnswers[action.index] = [action.payload];
      } else {
        // more than one correct answer
        currentAnswers[action.index] = action.checked
          ? [
              ...state.currentAnswers[action.index].filter(
                (item) => item !== "Select an item"
              ),
              action.payload,
            ]
          : [
              ...state.currentAnswers[action.index].filter(
                (item) => item !== action.payload
              ),
            ];
      }

      return {
        ...state,
        currentAnswers,
        showExplanation: false,
      };
    }
    case "ADD_QUESTION": {
      const allQuestions = [...state.allQuestions, action.newQuestion];

      return {
        ...state,
        questions: allQuestions.filter(
          (q) => q.groupNumber === state.currentGroupNumber
        ),
        allQuestions,
      };
    }
    case "UPDATE_CURRENT_GROUPNUMBER": {
      localStorage.setItem("currentGroupNumber", action.groupNumber);

      const groupNumberQuestions =
        action.groupNumber === 0
          ? state.allQuestions
          : state.allQuestions.filter(
              (q) => q.groupNumber === action.groupNumber
            );

      const firstQuestion = groupNumberQuestions[0];

      return {
        ...state,
        answers: shuffleAnswers(firstQuestion),
        currentAnswers: [
          ...new Array(firstQuestion.correctAnswers.length).fill([
            "Select an item",
          ]),
        ],
        currentGroupNumber: action.groupNumber,
        questions: groupNumberQuestions,
      };
    }
    case "UPDATE_QUESTION_GROUPNUMBERS": {
      const updatedQuestions = state.allQuestions.map((q) => {
        return action.selectedOptions.includes(q.examTopicId.toString())
          ? {
              ...q,
              groupNumber: action.groupNumber,
            }
          : q;
      });

      const currentQuestion = updatedQuestions[state.currentQuestionIndex];

      return {
        ...state,
        answers: shuffleAnswers(currentQuestion),
        currentAnswers: [
          ...new Array(currentQuestion.correctAnswers.length).fill([
            "Select an item",
          ]),
        ],
        questions: updatedQuestions.filter(
          (q) => q.groupNumber === state.currentGroupNumber
        ),
        allQuestions: updatedQuestions,
      };
    }
    case "UPDATE_QUESTION": {
      const updatedQuestions = state.allQuestions.map((q) => {
        return q.id === action.questionId
          ? {
              ...q,
              question: action.question,
              questionBelowImg: action.questionBelowImg,
              correctAnswers: action.correctAnswers,
              incorrectAnswers: action.incorrectAnswers,
              explanation: action.explanation,
              imageUrl: action.imageUrl,
              examTopicId: action.examTopicId,
              answerArea: action.answerArea,
              lastModified: action.newLastModified,
              groupNumber: action.groupNumber,
            }
          : q;
      });

      const currentQuestion = updatedQuestions[state.currentQuestionIndex];

      return {
        ...state,
        answers: shuffleAnswers(currentQuestion),
        currentAnswers: [
          ...new Array(currentQuestion.correctAnswers.length).fill([
            "Select an item",
          ]),
        ],
        questions: updatedQuestions.filter(
          (q) => q.groupNumber === state.currentGroupNumber
        ),
        allQuestions: updatedQuestions,
      };
    }
    case "PREV_QUESTION": {
      const prevQuestion = state.questions[state.currentQuestionIndex - 1];
      const correctAnswerCount =
        state.correctAnswerCount > 0 ? state.correctAnswerCount - 1 : 0;

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
        correctAnswerCount,
        solveQuestion: false,
        answers: shuffleAnswers(prevQuestion),
        currentAnswers: [
          ...new Array(prevQuestion.correctAnswers.length).fill([
            "Select an item",
          ]),
        ],
        showExplanation: false,
      };
    }
    case "NEXT_QUESTION": {
      const showResults =
        !action.solveQuestion &&
        state.currentQuestionIndex === state.questions.length - 1;
      const currentQuestionIndex =
        showResults || action.solveQuestion
          ? state.currentQuestionIndex
          : state.currentQuestionIndex + 1;
      const answers =
        showResults || action.solveQuestion
          ? state.answers
          : shuffleAnswers(state.questions[currentQuestionIndex]);

      let correctAnswerCount = state.correctAnswerCount;
      let failedQuestions = state.failedQuestions;
      const currentQuestion = state.questions[state.currentQuestionIndex];

      if (action.solveQuestion) {
        if (
          arraysContainSameStrings(
            state.currentAnswers,
            state.questions[state.currentQuestionIndex]
          )
        ) {
          failedQuestions = state.failedQuestions.filter(
            (fq) => fq.examTopicId !== currentQuestion.examTopicId
          );
          correctAnswerCount++;
        } else {
          // Check if a question with the same examTopicId already exists
          const alreadyExists = failedQuestions.some(
            (question) => question.examTopicId === currentQuestion.examTopicId
          );

          if (!alreadyExists) {
            failedQuestions.push(currentQuestion);
          }
        }
      }
      // console.log(failedQuestions);
      // console.log(`failedQuestions: ${failedQuestions.length}`);

      return {
        ...state,
        failedQuestions,
        currentQuestionIndex,
        showResults,
        solveQuestion: action.solveQuestion,
        correctAnswerCount,
        answers,
        currentAnswers: action.solveQuestion
          ? state.currentAnswers
          : [
              ...new Array(
                state.questions[currentQuestionIndex].correctAnswers.length
              ).fill(["Select an item"]),
            ],
        showExplanation: action.solveQuestion,
      };
    }
    case "EXPLANATION": {
      return {
        ...state,
        showExplanation: !state.showExplanation,
      };
    }
    case "DARK_MODE": {
      localStorage.setItem("theme", action.isDarkMode ? "dark" : "light");

      return {
        ...state,
        isDarkMode: action.isDarkMode,
      };
    }
    case "DELETE_QUESTION": {
      const allQuestions = state.allQuestions.filter(
        (q) => q.id !== action.currentQuestionId
      );

      const questions = state.questions.filter(
        (q) => q.id !== action.currentQuestionId
      );

      const failedQuestions = state.failedQuestions.filter(
        (q) => q.id !== action.currentQuestionId
      );

      return {
        ...state,
        questions,
        allQuestions,
        failedQuestions,
      };
    }
    case "GET_ALL_COLLECTIONS": {
      const exam = action.examArray.find(
        (name) => name.number === state.currentExamNumber
      );

      return {
        ...state,
        examArray: action.examArray,
        currentExamNumber: exam?.number ?? action.examArray[0].number,
      };
    }
    case "SELECT_EXAM": {
      localStorage.setItem("currentExamNumber", action.payload);

      return {
        ...state,
        currentExamNumber: action.payload,
      };
    }
    case "RESTART": {
      const groupNumberQuestions = action.onlyFailed
        ? state.failedQuestions
        : state.currentGroupNumber === 0
        ? action.payload
        : action.payload.filter(
            (q) => q.groupNumber === state.currentGroupNumber
          );

      const shuffledQuestions = shuffle(groupNumberQuestions);

      return {
        ...initialState,
        failedQuestions: action.onlyFailed ? state.failedQuestions : [],
        currentGroupNumber: state.currentGroupNumber,
        examArray: state.examArray,
        currentExamNumber: state.currentExamNumber,
        isDarkMode: state.isDarkMode,
        questions: shuffledQuestions,
        allQuestions: action.payload,
        currentAnswers:
          shuffledQuestions.length > 0
            ? [
                ...new Array(shuffledQuestions[0].correctAnswers.length).fill([
                  "Select an item",
                ]),
              ]
            : [],
        answers: shuffleAnswers(shuffledQuestions[0]),
      };
    }
    default: {
      return state;
    }
  }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const value = useReducer(quizReducer, initialState);
  const [state, dispatch] = value;

  useEffect(() => {
    const getAllCollections = async () => {
      const examArray = await fetchCollectionNames();
      dispatch({ type: "GET_ALL_COLLECTIONS", examArray });
    };

    getAllCollections();
  }, []);

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getExamQuestions(state.currentExamNumber);

      dispatch({ type: "RESTART", payload: data, onlyFailed: false });
    };

    if (state.currentExamNumber) {
      getQuestions();
    }
  }, [state.currentExamNumber]);

  // Effect to toggle the attribute on the <html> tag
  useEffect(() => {
    const htmlElement = document.documentElement;

    if (state.isDarkMode) {
      // Add the attribute when the button is clicked (state is true)
      htmlElement.setAttribute("data-bs-theme", "dark");
    } else {
      // Remove the attribute when the button is clicked again (state is false)
      htmlElement.removeAttribute("data-bs-theme");
    }
  }, [state.isDarkMode]); // Run the effect whenever the state changes

  // const value = { reducer, questions: state.questions };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
