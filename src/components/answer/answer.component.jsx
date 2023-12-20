import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import "./answer.styles.css";

const Answer = ({
  answerText,
  index,
  onSelectAnswer,
  currentAnswers,
  correctAnswers,
  solveQuestion,
}) => {
  // const [checked, setChecked] = useState(false);

  // const handleChange = () => {
  //   setChecked((prevChecked) => !prevChecked);
  // };

  const letterMapping = ["A", "B", "C", "D"];
  const isCorrectAnswer = solveQuestion && correctAnswers.includes(answerText);
  const isWrongAnswer = solveQuestion && !correctAnswers.includes(answerText);
  const correctAnswerClass = isCorrectAnswer ? "correct-answer" : "";
  const wrongAnswerClass =
    currentAnswers.includes(answerText) && isWrongAnswer ? "wrong-answer" : "";
  const disabledClass = solveQuestion ? "disabled-answer" : "";
  return (
    <Row>
      <Col>
        <Form.Check
          className={`${correctAnswerClass} ${wrongAnswerClass} ${disabledClass} hover-border ps-5 py-3`}
          type={correctAnswers.length === 1 ? "radio" : "checkbox"}
          checked={currentAnswers.includes(answerText)}
          onChange={(e) => {
            // handleChange();
            onSelectAnswer(e.target.checked, answerText);
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
