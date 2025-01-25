import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Trash3 } from "react-bootstrap-icons";
import PropTypes from "prop-types";
// import "./answer.styles.css";

const NewAnswer = ({
  index,
  blockindex,
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
          onChangeCheckbox(blockindex, index, e.target.checked);
        }}
      />
      <Form.Control
        as="textarea"
        rows={2}
        value={answerText}
        isInvalid={isCheckboxInvalid}
        onChange={(e) => {
          onChangeAnswer(blockindex, index, e.target.value);
        }}
      />
      <Button
        className="pe-0 text-danger"
        variant="link"
        title="Delete answer"
        onClick={() => {
          onDeleteAnswer(blockindex, index);
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
NewAnswer.propTypes = {
  index: PropTypes.number.isRequired,
  blockindex: PropTypes.number.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  onChangeAnswer: PropTypes.func.isRequired,
  onChangeCheckbox: PropTypes.func.isRequired,
  answerText: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  isLastAnswer: PropTypes.bool.isRequired,
  isCheckboxInvalid: PropTypes.bool.isRequired,
};

export default NewAnswer;
