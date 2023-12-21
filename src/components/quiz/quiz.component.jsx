import { useContext } from "react";
import { QuizContext } from "../../contexts/QuizContext";
import Question from "../question/question.component";
import "./quiz.styles.css";
import QuizComplete from "../quizComplete/quizComplete.component";
import DarkMode from "../darkMode/darkMode.component";
import Navigation from "../Navigation";

const Quiz = () => {
  const { reducer, questions } = useContext(QuizContext);
  const [quizState, dispatch] = reducer;

  return (
    <div>
      <Navigation />
      {quizState.showResults && <QuizComplete />}
      {!quizState.showResults && <Question />}
      <DarkMode />
    </div>
  );
};

export default Quiz;
