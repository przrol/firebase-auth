import { createContext, useEffect, useReducer, useState } from "react";
import { shuffleAnswers } from "../helpers";
import { getQuestionsAndDocuments } from "../firebase";

const initialState = {
  //   questions: questions.sort(() => Math.random() - 0.5),
  //   shuffleAnswers(questions[0]
  questions: [],
  currentQuestionIndex: 0,
  showResults: false,
  correctAnswerCount: 0,
  answers: [],
  currentAnswer: "",
  showExplanation: false,
};

const reducer = (state, action) => {
  console.log("reducer", state, action);
  switch (action.type) {
    case "SELECT_ANSWER": {
      const correctAnswerCount =
        action.payload ===
        state.questions[state.currentQuestionIndex].correctAnswer
          ? state.correctAnswerCount + 1
          : state.correctAnswerCount;
      return {
        ...state,
        currentAnswer: action.payload,
        correctAnswerCount,
        showExplanation: true,
      };
    }
    case "NEXT_QUESTION": {
      const showResults =
        state.currentQuestionIndex === state.questions.length - 1;
      const currentQuestionIndex = showResults
        ? state.currentQuestionIndex
        : state.currentQuestionIndex + 1;
      const answers = showResults
        ? []
        : shuffleAnswers(state.questions[currentQuestionIndex]);
      return {
        ...state,
        currentQuestionIndex,
        showResults,
        answers,
        currentAnswer: "",
        showExplanation: false,
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
  const value = useReducer(reducer, initialState);
  const [state, dispatch] = value;

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getQuestionsAndDocuments();
      console.log(data);
      //   setQuestions(data);
      dispatch({ type: "RESTART", payload: data });
    };

    getQuestions();
  }, []);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
