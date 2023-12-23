import { createContext, useEffect, useReducer } from "react";
import { arraysContainSameStrings, shuffle, shuffleAnswers } from "../helpers";
import { getQuestionsAndDocuments } from "../firebase";

const initialState = {
  //   questions: questions.sort(() => Math.random() - 0.5),
  //   shuffleAnswers(questions[0]
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
};

const quizReducer = (state, action) => {
  // console.log("reducer", state, action);
  switch (action.type) {
    case "SELECT_ANSWER": {
      // payload -> "answerText"
      const questionCorrectAnswers =
        state.questions[state.currentQuestionIndex].correctAnswers;
      const currentAnswers =
        questionCorrectAnswers.length === 1
          ? [action.payload]
          : action.checked
          ? [...state.currentAnswers, action.payload]
          : state.currentAnswers.filter((item) => item !== action.payload);
      const correctAnswerCount = arraysContainSameStrings(
        currentAnswers,
        questionCorrectAnswers
      )
        ? state.correctAnswerCount + 1
        : state.correctAnswerCount;
      return {
        ...state,
        currentAnswers,
        correctAnswerCount,
        showExplanation: false,
        // currentAnswers.length >=
        // state.questions[state.currentQuestionIndex].correctAnswers.length,
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
      return {
        ...state,
        currentQuestionIndex,
        showResults,
        solveQuestion: action.solveQuestion,
        answers,
        currentAnswers: action.solveQuestion ? state.currentAnswers : [],
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
    case "RESTART": {
      const shuffledQuestions = shuffle(action.payload);

      return {
        ...initialState,
        isDarkMode: state.isDarkMode,
        questions: shuffledQuestions,
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
    const getQuestions = async () => {
      const data = await getQuestionsAndDocuments();
      dispatch({ type: "RESTART", payload: data });
    };

    getQuestions();
  }, []);

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
