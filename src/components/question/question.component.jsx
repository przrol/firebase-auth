import { useContext } from "react";
import { QuizContext } from "../../contexts/QuizContext";
import { replaceWithBr, arraysContainSameStrings } from "../../helpers";
import Answer from "../answer/answer.component";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
// import "./question.styles.css";

const Question = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const questionWithBr = replaceWithBr(currentQuestion.question);

  let cardBorder = "";
  if (quizState.solveQuestion) {
    cardBorder = arraysContainSameStrings(
      quizState.currentAnswers,
      currentQuestion.correctAnswers
    )
      ? "question-solved"
      : "question-not-solved";
  }

  return (
    <>
      <Card
        bg={quizState.isDarkMode ? "dark" : "light"}
        className={`mx-auto ${cardBorder}`}
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="text-center">{`Frage ${
          quizState.currentQuestionIndex + 1
        } von ${quizState.questions.length}`}</Card.Header>
        <Card.Body>
          <Card.Text
            className="ps-2"
            dangerouslySetInnerHTML={{ __html: questionWithBr }}
          ></Card.Text>
          <Form>
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
        </Card.Body>
      </Card>

      <Row className="mt-3" hidden={!quizState.showExplanation}>
        <Col>
          <div
            className="explanation"
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(
                currentQuestion.explanation || "No explanation available!"
              ),
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default Question;
