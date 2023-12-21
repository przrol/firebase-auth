import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../contexts/QuizContext";

export default function QuizComplete() {
  const { reducer, questions } = useContext(QuizContext);
  const [state, dispatch] = reducer;
  const navigate = useNavigate();

  const handleRestart = () => {
    dispatch({ type: "RESTART", payload: questions });
    navigate("/");
  };

  return (
    <>
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto mt-1"
        style={{ maxWidth: "800px" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4">Congratulations!</h2>
          <Card.Title>Congratulations!</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
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
