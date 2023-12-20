import { createContext, useEffect, useReducer, useState } from "react";
import { arraysContainSameStrings, shuffleAnswers } from "../helpers";
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
    case "RESTART": {
      return {
        ...initialState,
        questions: action.payload,
        answers: shuffleAnswers(action.payload[0]),
      };
    }
    default: {
      return state;
    }
  }
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const reducer = useReducer(quizReducer, initialState);
  const [state, dispatch] = reducer;

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getQuestionsAndDocuments();
      // console.log(data);
      setQuestions(data);
      dispatch({ type: "RESTART", payload: data });
    };

    getQuestions();
  }, []);

  const value = { reducer, questions };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
