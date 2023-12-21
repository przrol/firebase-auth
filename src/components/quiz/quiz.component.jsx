import { useContext } from "react";
import { QuizContext } from "../../contexts/QuizContext";
import Question from "../question/question.component";
import "./quiz.styles.css";
import QuizComplete from "../quizComplete/quizComplete.component";
import Navigation from "../Navigation";
import DarkMode from "../darkMode/darkMode.component";

const Quiz = () => {
  const { reducer } = useContext(QuizContext);
  const [quizState] = reducer;

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
