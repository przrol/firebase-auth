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
};

const quizReducer = (state, action) => {
  // console.log("reducer", state, action);
  switch (action.type) {
    case "SELECT_ANSWER": {
      // payload -> "answerText"
      const currentAnswers = action.checked
        ? [state.currentAnswers, action.payload]
        : state.currentAnswers.filter((item) => item !== action.payload);
      const correctAnswerCount = arraysContainSameStrings(
        currentAnswers,
        state.questions[state.currentQuestionIndex].correctAnswers
      )
        ? state.correctAnswerCount + 1
        : state.correctAnswerCount;
      return {
        ...state,
        currentAnswers,
        correctAnswerCount,
        showExplanation:
          currentAnswers.length >=
          state.questions[state.currentQuestionIndex].correctAnswers.length,
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
        currentAnswers: [],
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
