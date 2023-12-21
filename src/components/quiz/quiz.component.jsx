import { useContext } from "react";
import { QuizContext } from "../../contexts/QuizContext";
import Question from "../question/question.component";
import "./quiz.styles.css";
// import QuizComplete from "../quizComplete/quizComplete.component";
import Navigation from "../Navigation";
import DarkMode from "../darkMode/darkMode.component";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const Quiz = () => {
  const { reducer, questions } = useContext(QuizContext);
  const [state, dispatch] = reducer;

  return (
    <div>
      <Navigation />
      {state.showResults ? (
        <Card
          bg={state.isDarkMode ? "dark" : "light"}
          className="mx-auto text-center"
          style={{ maxWidth: "800px" }}
        >
          <Card.Header>Congratulations!</Card.Header>
          <Card.Body>
            <Card.Text>You have completed the quiz.</Card.Text>
            <Card.Text>
              You've got {state.correctAnswerCount} of {state.questions.length}{" "}
              right.
            </Card.Text>
            <Button
              variant="success"
              className="w-100"
              type="button"
              onClick={() => {
                dispatch({ type: "RESTART", payload: questions });
              }}
            >
              RESTART
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Question />
      )}
      <DarkMode />
    </div>
  );
};

export default Quiz;
