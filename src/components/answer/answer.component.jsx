import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import PropTypes from "prop-types";
// import "./answer.styles.css";

const Answer = ({
  answerText,
  index,
  blockindex,
  // correctAnswers,
  // answerArea,
  quizState,
  dispatch,
  currentQuestionIndex,
  currentQuestion,
}) => {
  // const letterMapping = ["A", "B", "C", "D", "E", "F"];
  const correctAnswers = currentQuestion.correctAnswers[blockindex];
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
            correctAnswers.length === 1 &&
            !currentQuestion.question
              .toLowerCase()
              .includes("select yes if the statement is true")
              ? "radio"
              : "checkbox"
          }
          checked={
            quizState.currentAnswers.length > blockindex &&
            quizState.currentAnswers[blockindex].includes(answerText)
          }
          onChange={(e) => {
            dispatch({
              type: "SELECT_ANSWER",
              payload: answerText,
              index: blockindex,
              checked: e.target.checked,
              currentQuestionIndex,
            });
          }}
          id={`checkRadio-${blockindex}-${index}`}
          label={answerText}
        />
      </Col>
    </Row>
  );
};
Answer.propTypes = {
  answerText: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  blockindex: PropTypes.number.isRequired,
  currentQuestion: PropTypes.object.isRequired,
  // correctAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  // answerArea: PropTypes.bool.isRequired,
  quizState: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
};

export default Answer;
