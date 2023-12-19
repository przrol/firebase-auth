import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
// import "./answer.styles.css";

const Answer = ({
  answerText,
  index,
  onSelectAnswer,
  currentAnswers,
  correctAnswers,
  solveQuestion,
}) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  const letterMapping = ["A", "B", "C", "D"];
  const isCorrectAnswer = solveQuestion && correctAnswers.includes(answerText);
  const isWrongAnswer = solveQuestion && !correctAnswers.includes(answerText);
  const correctAnswerClass = isCorrectAnswer ? "correct-answer" : "";
  const wrongAnswerClass = checked && isWrongAnswer ? "wrong-answer" : "";
  const disabledClass = solveQuestion ? "disabled-answer" : "";
  return (
    <Row>
      <Col>
        <Form.Check
          className={`${correctAnswerClass} ${wrongAnswerClass} ${disabledClass} hover-border ps-5 py-3`}
          type="checkbox"
          checked={checked}
          onChange={() => {
            handleChange();
            onSelectAnswer(answerText);
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