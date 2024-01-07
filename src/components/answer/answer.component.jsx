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
  answerArea,
}) => {
  const letterMapping = ["A", "B", "C", "D", "E", "F"];
  const isCorrectAnswer = solveQuestion && correctAnswers.includes(answerText);
  const isWrongAnswer = solveQuestion && !correctAnswers.includes(answerText);
  const correctAnswerClass = isCorrectAnswer ? "correct-answer" : "";
  const wrongAnswerClass =
    currentAnswers.includes(answerText) && isWrongAnswer ? "wrong-answer" : "";
  const disabledClass = solveQuestion ? "disabled-answer" : "";

  // const [isMounted, setIsMounted] = useState(false);

  // // When the component mounts, set isMounted to true
  // useEffect(() => {
  //   setIsMounted(true);
  // }, [answerText]);

  return (
    <Row>
      <Col className="answerColumn">
        <Form.Check
          className={`${correctAnswerClass} ${wrongAnswerClass} ${disabledClass} hover-border py-3`}
          type={
            answerArea || correctAnswers.length === 1 ? "radio" : "checkbox"
          }
          checked={currentAnswers.includes(answerText)}
          onChange={(e) => {
            // handleChange();
            onSelectAnswer(e.target.checked, answerText);
          }}
          id={`checkRadio-${index}`}
          label={
            <>
              <span className="me-1">{letterMapping[index]}.</span>
              {answerText}
            </>
          }
          /* <div
          className="pointer-cursor hover-border py-3"
          dangerouslySetInnerHTML={{
            __html: `${letterMapping[index]}) ${answerText}`,
          }}
        /> */
        />
      </Col>
    </Row>
  );
};

export default Answer;
