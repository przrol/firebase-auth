import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";
import { replaceWithBr } from "../helpers";
import Answer from "./Answer";
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
          <div
            className="bg-primary text-white text-center py-3 mb-2"
            dangerouslySetInnerHTML={{ __html: questionWithBr }}
          ></div>
        </Col>
      </Row>
      <Form>
        <div>
          {quizState.answers.map((answer, index) => (
            <Answer
              answerText={answer}
              key={index}
              index={index}
              currentAnswer={quizState.currentAnswer}
              correctAnswer={currentQuestion.correctAnswer}
              onSelectAnswer={(answerText) =>
                dispatch({ type: "SELECT_ANSWER", payload: answerText })
              }
            />
          ))}
        </div>
        <Row className="mt-2">
          <Col className="text-center">
            <Button
              type="button"
              variant="dark"
              size="lg"
              onClick={() => dispatch({ type: "NEXT_QUESTION" })}
            >
              Nächste Frage
            </Button>
          </Col>
        </Row>
      </Form>
      {quizState.showExplanation && (
        <div>
          <div className="explanation">
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
      )}
    </div>
  );
};

export default Question;
