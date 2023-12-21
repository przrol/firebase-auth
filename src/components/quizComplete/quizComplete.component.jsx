import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../contexts/QuizContext";

export default function QuizComplete() {
  const { reducer, questions } = useContext(QuizContext);
  const [state, dispatch] = reducer;
  const navigate = useNavigate();

  const handleRestart = (e) => {
    e.preventDefault();

    dispatch({ type: "RESTART", payload: questions });
    navigate("/");
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
          {/* <Card.Title className="mb-3">Congratulations!</Card.Title> */}
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
}
