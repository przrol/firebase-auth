import { useContext } from "react";
import { QuizContext, QuizProvider } from "../../contexts/QuizContext";
import Question from "../Question";
import "./quiz.styles.css";
import { Button, Col, Row } from "react-bootstrap";
import Navigation from "../Navigation";

const Quiz = () => {
  const { reducer, questions } = useContext(QuizContext);
  const [quizState, dispatch] = reducer;
  // console.log(quizState);
  return (
    <div>
      <Navigation />
      <Row>
        <Col>
          <div className="bg-light py-2"></div>
        </Col>
      </Row>
      {quizState.showResults && (
        <div>
          <Row>
            <Col>
              <div className="bg-primary fs-4 text-white text-center py-2">
                Congratulations!
              </div>
            </Col>
          </Row>
          <div className="bg-light">
            <Row>
              <Col>
                <div className="fs-5 text-center pt-3 pb-2">
                  You have completed the quiz.
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fs-5 text-center">
                  You've got {quizState.correctAnswerCount} of{" "}
                  {quizState.questions.length} right.
                </div>
              </Col>
            </Row>
            <Row className="mt-5 pb-4">
              <Col className="text-center">
                <Button
                  className="text-uppercase"
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={() =>
                    dispatch({ type: "RESTART", payload: questions })
                  }
                >
                  Restart
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
      {!quizState.showResults && <Question />}
    </div>
  );
};

export default Quiz;
