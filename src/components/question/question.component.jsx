import { useContext } from "react";
import { QuizContext } from "../../contexts/QuizContext";
import { replaceWithBr, arraysContainSameStrings } from "../../helpers";
import Answer from "../answer/answer.component";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import { PencilSquare, QuestionCircle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import "./question.styles.css";

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
        style={{ maxWidth: "800px", transition: "all 1s" }}
      >
        <Card.Header className="d-flex justify-content-between">
          <div style={{ width: "26.7125px" }}></div>
          <div className="">{`Frage ${quizState.currentQuestionIndex + 1} von ${
            quizState.questions.length
          }`}</div>
          <div>#{currentQuestion.examTopicId}</div>
        </Card.Header>
        <Card.Body>
          <Card.Text
            className="ps-2"
            dangerouslySetInnerHTML={{ __html: questionWithBr }}
          ></Card.Text>
          <Form>
            {currentQuestion.imageUrl && (
              <Image
                className="px-2 mb-3"
                src={currentQuestion.imageUrl}
                fluid
              />
            )}
            {currentQuestion.questionBelowImg && (
              <Card.Text className="ps-2">
                {currentQuestion.questionBelowImg}
              </Card.Text>
            )}
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
            <Row className="mt-4 pb-3">
              <Col className="d-flex justify-content-between">
                <Button
                  className="text-uppercase ms-2"
                  type="button"
                  variant="warning"
                  size="sm"
                  onClick={() => dispatch({ type: "EXPLANATION" })}
                >
                  <QuestionCircle />
                </Button>
                <div>
                  <Button
                    className="text-uppercase me-2"
                    type="button"
                    variant="success"
                    size="sm"
                    onClick={() =>
                      dispatch({
                        type: "PREV_QUESTION",
                        solveQuestion: !quizState.solveQuestion,
                      })
                    }
                  >
                    PREV
                  </Button>
                  <Button
                    className="text-uppercase ms-1"
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
                    NEXT
                  </Button>
                </div>
                <Link
                  className="edit-link text-end me-2"
                  to={`editquestion/${currentQuestion.id}`}
                >
                  <PencilSquare />
                </Link>
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
