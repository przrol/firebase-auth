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
  isCheckboxInvalid,
}) => {
  return (
    <InputGroup
      hasValidation
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
        isInvalid={isCheckboxInvalid}
        onChange={(e) => {
          onChangeAnswer(index, e.target.value);
        }}
      />
      <Button
        className="pe-0 text-danger"
        variant="link"
        title="Delete answer"
        onClick={() => {
          onDeleteAnswer(index);
        }}
      >
        <Trash3 />
      </Button>
      <Form.Control.Feedback type="invalid">
        Please mark at least one answer as correct
      </Form.Control.Feedback>
    </InputGroup>
  );
};

export default NewAnswer;
