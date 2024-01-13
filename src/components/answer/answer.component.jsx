import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import "./answer.styles.css";

const Answer = ({
  answerText,
  index,
  blockindex,
  correctAnswers,
  answerArea,
  quizState,
  dispatch,
}) => {
  const letterMapping = ["A", "B", "C", "D", "E", "F"];
  const isCorrectAnswer =
    quizState.solveQuestion && correctAnswers.includes(answerText);
  const isWrongAnswer =
    quizState.solveQuestion && !correctAnswers.includes(answerText);
  const correctAnswerClass = isCorrectAnswer ? "correct-answer" : "";
  const wrongAnswerClass =
    quizState.currentAnswers.length > 0 &&
    quizState.currentAnswers[blockindex].includes(answerText) &&
    isWrongAnswer
      ? "wrong-answer"
      : "";
  const disabledClass = quizState.solveQuestion ? "disabled-answer" : "";

  return (
    <Row>
      <Col className="answerColumn">
        <Form.Check
          className={`${correctAnswerClass} ${wrongAnswerClass} ${disabledClass} hover-border py-3`}
          type={
            answerArea || correctAnswers.length === 1 ? "radio" : "checkbox"
          }
          checked={
            quizState.currentAnswers.length > 0 &&
            quizState.currentAnswers[blockindex].includes(answerText)
          }
          onChange={(e) => {
            dispatch({
              type: "SELECT_ANSWER",
              payload: answerText,
              index: blockindex,
              checked: e.target.checked,
            });
          }}
          id={`checkRadio-${index}`}
          label={
            <>
              <span className="me-1">{letterMapping[index]}.</span>
              {answerText}
            </>
          }
        />
      </Col>
    </Row>
  );
};

export default Answer;
