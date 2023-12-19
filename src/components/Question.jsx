import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";
import { replaceWithBr } from "../helpers";
import Answer from "./answer/answer.component";
import { Button, Col, Form, Row } from "react-bootstrap";

const Question = () => {
  const { reducer } = useContext(QuizContext);
  const [quizState, dispatch] = reducer;
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const questionWithBr = replaceWithBr(currentQuestion.question);

  return (
    <div>
      <Row>
        <Col>
          <div className="bg-primary text-white ps-3 py-3">
            <span className="me-2 text-black fw-bold">{`${
              quizState.currentQuestionIndex + 1
            }/${quizState.questions.length})`}</span>
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
              onSelectAnswer={(answerText) =>
                dispatch({
                  type: "SELECT_ANSWER",
                  payload: answerText,
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
      {/* {quizState.showExplanation && ( */}
      <div className="explanation" hidden={!quizState.showExplanation}>
        <div>
          <div>
            <p style={{ fontWeight: "bold" }}>Erklärung (ChatGPT)</p>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(currentQuestion.explanationChatGPT),
              }}
            />
          </div>
        </div>

        <div
          className="explanation"
          dangerouslySetInnerHTML={{
            __html: replaceWithBr(currentQuestion.explanationUdemy),
          }}
        />
      </div>
      {/* )} */}
    </div>
  );
};

export default Question;
