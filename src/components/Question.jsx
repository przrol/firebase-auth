import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";
import { replaceWithBr } from "../helpers";
import Answer from "./answer/answer.component";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const Question = () => {
  const { reducer } = useContext(QuizContext);
  const [quizState, dispatch] = reducer;
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const questionWithBr = replaceWithBr(currentQuestion.question);

  return (
    <div>
      <Row>
        <Col>
          <div className="bg-primary text-white px-3 py-3">
            <div className="me-2 mb-1 text-black fw-bold">{`Frage ${
              quizState.currentQuestionIndex + 1
            } von ${quizState.questions.length}`}</div>
            <span
              dangerouslySetInnerHTML={{
                __html: questionWithBr,
              }}
            ></span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="bg-light py-2"></div>
        </Col>
      </Row>
      <Form className="bg-light">
        <div>
          {quizState.answers.map((answer, index) => (
            <Answer
              answerText={answer}
              key={index}
              index={index}
              currentAnswers={quizState.currentAnswers}
              solveQuestion={quizState.solveQuestion}
              correctAnswers={currentQuestion.correctAnswers}
              onSelectAnswer={(checked, answerText) =>
                dispatch({
                  type: "SELECT_ANSWER",
                  payload: answerText,
                  checked,
                })
              }
            />
          ))}
        </div>
        <Row className="mt-2 pb-4">
          <Col className="text-center">
            <Button
              className="text-uppercase me-2"
              type="button"
              variant="warning"
              size="sm"
              onClick={() => dispatch({ type: "EXPLANATION" })}
            >
              Erklärung
            </Button>
            <Button
              className="text-uppercase"
              type="button"
              variant="success"
              size="sm"
              onClick={() =>
                dispatch({
                  type: "NEXT_QUESTION",
                  solveQuestion: !quizState.solveQuestion,
                })
              }
            >
              Nächste Frage
            </Button>
          </Col>
        </Row>
      </Form>
      <Row className="mt-3" hidden={!quizState.showExplanation}>
        <Col>
          <div
            className="explanation"
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(currentQuestion.explanation),
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Question;
