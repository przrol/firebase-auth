import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Trash3 } from "react-bootstrap-icons";
// import "./answer.styles.css";

const NewAnswer = ({
  index,
  onDeleteAnswer,
  onChangeAnswer,
  onChangeCheckbox,
  answerText,
  checked,
  isLastAnswer,
}) => {
  return (
    <InputGroup
      id={`answerText-${index}`}
      className={isLastAnswer ? "" : "mb-3"}
    >
      <InputGroup.Checkbox
        checked={checked}
        onChange={(e) => {
          onChangeCheckbox(index, e.target.checked);
        }}
      />
      <Form.Control
        as="textarea"
        rows={2}
        value={answerText}
        onChange={(e) => {
          onChangeAnswer(index, e.target.value);
        }}
      />
      <Button
        className="pe-0 text-danger"
        variant="link"
        onClick={() => {
          onDeleteAnswer(index);
        }}
      >
        <Trash3 />
      </Button>
    </InputGroup>
  );
};

export default NewAnswer;
