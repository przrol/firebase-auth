import { Col, Form, Row } from "react-bootstrap";

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
    <Row onClick={() => !disabledClass && onSelectAnswer(answerText)}>
      <Col>
        <Form.Check
          className={`${correctAnswerClass} ${wrongAnswerClass} ${disabledClass} pointer-cursor hover-border ps-5 py-3`}
          type="checkbox"
          checked={currentAnswer === answerText}
          id={`checkRadio-${index}`}
          label={answerText}
        />
        {/* <div
          className="pointer-cursor hover-border py-3"
          dangerouslySetInnerHTML={{
            __html: `${letterMapping[index]}) ${answerText}`,
          }}
        /> */}
      </Col>
    </Row>
  );
};

export default Answer;
