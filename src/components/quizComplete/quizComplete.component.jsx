import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { QuizContext } from "../../contexts/QuizContext";

const QuizComplete = () => {
  const [state, dispatch] = useContext(QuizContext);

  return (
    <>
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto text-center"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header>{`Congratulations! (${state.currentExamNumber})`}</Card.Header>
        <Card.Body>
          <Card.Text>You have completed the quiz.</Card.Text>
          <Card.Text>
            You've got {state.correctAnswerCount} of {state.questions.length}{" "}
            right.
          </Card.Text>
          <div className="d-sm-flex justify-content-between">
            <Button
              variant="success"
              type="button"
              className="w-100 me-sm-5 mb-4 mb-sm-0"
              onClick={() => {
                dispatch({
                  type: "RESTART",
                  payload: state.allQuestions,
                  onlyFailed: false,
                });
              }}
            >
              RESTART
            </Button>
            {state.failedQuestions.length > 0 && (
              <Button
                variant="danger"
                type="button"
                className="w-100 ms-sm-5"
                onClick={() => {
                  dispatch({
                    type: "RESTART",
                    payload: state.allQuestions,
                    onlyFailed: true,
                  });
                }}
              >
                {`RESTART FAILED (${state.failedQuestions.length})`}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default QuizComplete;
