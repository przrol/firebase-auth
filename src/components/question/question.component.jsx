import React, { useContext } from "react";
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
import AnswerDropdown from "../answerDropdown/answerDropdown.component";

const Question = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const questionWithBr = replaceWithBr(
    currentQuestion ? currentQuestion.question : ""
  );
  const answerAreaWithBr = replaceWithBr(
    currentQuestion ? currentQuestion.answerArea : ""
  );
  const answerAreaParts = answerAreaWithBr.split("_dropdown_");

  let cardBorder = "";
  if (quizState.solveQuestion) {
    cardBorder = arraysContainSameStrings(
      quizState.currentAnswers,
      currentQuestion
    )
      ? "question-solved"
      : "question-not-solved";
  }

  return (
    <>
      {currentQuestion ? (
        <>
          <Card
            bg={quizState.isDarkMode ? "dark" : "light"}
            className={`mx-auto ${cardBorder}`}
            style={{ maxWidth: "800px", transition: "all 1s" }}
          >
            <Card.Header className="d-flex justify-content-between">
              <div style={{ width: "35.34px" }}></div>
              <div className="">{`Frage ${
                quizState.currentQuestionIndex + 1
              } von ${quizState.questions.length} (${
                quizState.currentExamNumber
              })`}</div>
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

                {currentQuestion.answerArea ? (
                  <>
                    <Card.Text className="ps-2 mb-1 mt-1 fw-bold">
                      Answer Area
                    </Card.Text>
                    <div className="ps-2">
                      {answerAreaParts.map((part, index) => (
                        <React.Fragment key={index}>
                          <em dangerouslySetInnerHTML={{ __html: part }}></em>
                          {index < answerAreaParts.length - 1 && ( // Only render a button if it's not the last part
                            <AnswerDropdown
                              quizState={quizState}
                              index={index}
                              dispatch={dispatch}
                              currentQuestion={currentQuestion}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : (
                  quizState.answers.map((answerblock, blockindex) => (
                    <Form.Group key={blockindex} className="mb-3">
                      <Form.Label>{`Answer block ${
                        blockindex + 1
                      }`}</Form.Label>

                      {answerblock.map((answer, index) => (
                        <Answer
                          answerText={answer}
                          key={index}
                          index={index}
                          blockindex={blockindex}
                          answerArea={currentQuestion.answerArea}
                          quizState={quizState}
                          dispatch={dispatch}
                          correctAnswers={
                            currentQuestion.correctAnswers[blockindex]
                          }
                        />
                      ))}
                    </Form.Group>
                  ))
                )}
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
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          dispatch({
                            type: "PREV_QUESTION",
                          })
                        }
                      >
                        PREVIOUS
                      </Button>
                      <Button
                        className="text-uppercase ms-1"
                        type="button"
                        variant={
                          quizState.solveQuestion ? "primary" : "success"
                        }
                        size="sm"
                        onClick={() =>
                          dispatch({
                            type: "NEXT_QUESTION",
                            solveQuestion: !quizState.solveQuestion,
                          })
                        }
                      >
                        {quizState.solveQuestion
                          ? "NEXT QUESTION"
                          : "SOLVE QUESTION"}
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
      ) : (
        <div>No questions available!</div>
      )}
    </>
  );
};

export default Question;
