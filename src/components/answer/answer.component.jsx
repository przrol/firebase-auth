import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
// import "./answer.styles.css";

const Answer = ({
  answerText,
  index,
  onSelectAnswer,
  currentAnswers,
  correctAnswers,
}) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  const letterMapping = ["A", "B", "C", "D"];
  const isCorrectAnswer =
    currentAnswers.length >= correctAnswers.length &&
    correctAnswers.includes(answerText);
  const isWrongAnswer =
    currentAnswers.length >= correctAnswers.length &&
    !correctAnswers.includes(answerText);
  const correctAnswerClass = isCorrectAnswer ? "correct-answer" : "";
  const wrongAnswerClass = isWrongAnswer ? "wrong-answer" : "";
  const disabledClass =
    currentAnswers.length >= correctAnswers.length ? "disabled-answer" : "";
  return (
    <Row>
      <Col>
        <Form.Check
          className={`${correctAnswerClass} ${wrongAnswerClass} ${disabledClass} pointer-cursor hover-border ps-5 py-3`}
          type="checkbox"
          checked={checked}
          onChange={() => {
            handleChange();
            onSelectAnswer(answerText, checked);
          }}
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
