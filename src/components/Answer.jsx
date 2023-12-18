import { Col, Row } from "react-bootstrap";

const Answer = ({
  answerText,
  index,
  onSelectAnswer,
  currentAnswer,
  correctAnswer,
}) => {
  const letterMapping = ["A", "B", "C", "D"];
  const isCorrectAnswer = currentAnswer && answerText === correctAnswer;
  const isWrongAnswer =
    currentAnswer === answerText && currentAnswer !== correctAnswer;
  const correctAnswerClass = isCorrectAnswer ? "correct-answer" : "";
  const wrongAnswerClass = isWrongAnswer ? "wrong-answer" : "";
  const disabledClass = currentAnswer ? "disabled-answer" : "";
  return (
    <Row
      className={`${correctAnswerClass} ${wrongAnswerClass} ${disabledClass}`}
      onClick={() => onSelectAnswer(answerText)}
    >
      <Col>
        <div
          className="pointer-cursor hover-border py-3"
          dangerouslySetInnerHTML={{
            __html: `${letterMapping[index]}) ${answerText}`,
          }}
        />
      </Col>
    </Row>
  );
};

export default Answer;
