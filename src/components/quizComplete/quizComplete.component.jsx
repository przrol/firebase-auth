import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { QuizContext } from "../../contexts/QuizContext";

const QuizComplete = () => {
  const [state, dispatch] = useContext(QuizContext);

  const handleRestart = (e) => {
    e.preventDefault();

    dispatch({ type: "RESTART", payload: state.questions });
    // navigate("/");
  };

  return (
    <>
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
            onClick={handleRestart}
          >
            RESTART
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default QuizComplete;
