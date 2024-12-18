import { createContext, useEffect, useReducer } from "react";
import { arraysContainSameStrings, shuffle, shuffleAnswers } from "../helpers";
import { getExamQuestions, fetchCollectionNames } from "../firebase";

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  showResults: false,
  correctAnswerCount: 0,
  answers: [],
  currentAnswers: [],
  showExplanation: false,
  solveQuestion: false,
  isDarkMode: localStorage.getItem("theme") === "dark",
  showDeleteModalDialog: false,
  imageUrl: "",
  examTopicId: 0,
  examArray: [],
  currentExamNumber: localStorage.getItem("currentExamNumber"),
  selectedVoices: window.speechSynthesis.getVoices().filter(v => v.name.startsWith('Microsoft Emma Online') || v.name === 'Google US English'),
  voiceRate: 1.1
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_ANSWER": {
      // payload -> "answerText"
      const currentQuestion = state.questions[state.currentQuestionIndex];

      const questionCorrectAnswers =
        currentQuestion.correctAnswers[action.index];

      const currentAnswers = [...state.currentAnswers];
      if (questionCorrectAnswers.length === 1) {
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
      // ? [...currentQuestion.currentAnswers, action.payload]
      // : action.checked
      // ? [...state.currentAnswers[action.index], action.payload]
      // : state.currentAnswers[action.index].filter(
      //     (item) => item !== action.payload
      //   );

      const newArray =
        state.currentAnswers.length > action.index
          ? [
              ...state.currentAnswers.slice(0, action.index),
              currentAnswers,
              ...state.currentAnswers.slice(action.index + 1),
            ]
          : [
              ...new Array(action.index).fill(["Select an item"]),
              currentAnswers,
            ];

      return {
        ...state,
        currentAnswers,
        showExplanation: false,
      };
    }
    case "ADD_QUESTION": {
      return {
        ...state,
        questions: [...state.questions, action.newQuestion],
      };
    }
    case "UPDATE_QUESTION": {
      const updatedQuestions = state.questions.map((q) => {
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
        questions: updatedQuestions,
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

      const correctAnswerCount =
        action.solveQuestion &&
        arraysContainSameStrings(
          state.currentAnswers,
          state.questions[state.currentQuestionIndex]
        )
          ? state.correctAnswerCount + 1
          : state.correctAnswerCount;

      // console.log("correctAnswerCount: ", correctAnswerCount);

      return {
        ...state,
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
    case "DELETE_MODALDIALOG": {
      return {
        ...state,
        showDeleteModalDialog: action.showDeleteModalDialog,
      };
    }
    case "GET_ALL_COLLECTIONS": {
      return {
        ...state,
        examArray: action.payload,
        currentExamNumber:
          state.currentExamNumber ??
          action.payload.find((name) => name.number.startsWith("AI-900"))
            .number,
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
      const shuffledQuestions = shuffle(action.payload);

      return {
        ...initialState,
        examArray: state.examArray,
        currentExamNumber: state.currentExamNumber,
        isDarkMode: state.isDarkMode,
        questions: shuffledQuestions,
        currentAnswers: [
          ...new Array(shuffledQuestions[0].correctAnswers.length).fill([
            "Select an item",
          ]),
        ],
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
      const data = await fetchCollectionNames();
      dispatch({ type: "GET_ALL_COLLECTIONS", payload: data });
    };

    getAllCollections();
  }, []);

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getExamQuestions(state.currentExamNumber);
      dispatch({ type: "RESTART", payload: data });
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
