import { useContext } from "react";
import { QuizContext } from "../../contexts/QuizContext";
import Question from "../question/question.component";
import "./quiz.styles.css";
// import QuizComplete from "../quizComplete/quizComplete.component";
import Navigation from "../Navigation";
import DarkMode from "../darkMode/darkMode.component";
import QuizComplete from "../quizComplete/quizComplete.component";

const Quiz = () => {
  const [state, dispatch] = useContext(QuizContext);

  return (
    <div>
      <Navigation />
      {state.showResults ? <QuizComplete /> : <Question />}
      <DarkMode />
    </div>
  );
};

export default Quiz;
