import { useContext } from "react";
import { QuizContext, QuizProvider } from "../contexts/QuizContext";
import Question from "./Question";

const Quiz = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  console.log(quizState);
  return (
    <div className="quiz">
      {quizState.showResults && (
        <div className="results">
          <div className="congratulations">Congratulations!</div>
          <div className="result-info">
            <div>You have completed the quiz.</div>
            <div>
              You've got {quizState.correctAnswerCount} of{" "}
              {quizState.questions.length} right.
            </div>
            <div
              className="next-button"
              onClick={() => dispatch({ type: "RESTART" })}
            >
              Restart
            </div>
          </div>
        </div>
      )}
      {!quizState.showResults && (
        <div>
          <div className="score">
            Frage {quizState.currentQuestionIndex + 1} von{" "}
            {quizState.questions.length}
          </div>
          <Question />
        </div>
      )}
    </div>
  );
};

export default Quiz;
