import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Trash3 } from "react-bootstrap-icons";
// import "./answer.styles.css";

const NewAnswer = ({ index }) => {
  const [checked, setChecked] = useState(false);
  const [answerText, setAnswerText] = useState("");

  const handleChange = (e) => {
    setChecked((prevChecked) => !prevChecked);
  };

  const handleAnswerText = (e) => {
    setAnswerText((prevText) => e.target.value);
  };

  return (
    <InputGroup id={`answerText-${index}`} className="mb-3">
      <InputGroup.Checkbox checked={checked} onChange={handleChange} />
      <Form.Control
        as="textarea"
        rows={2}
        value={answerText}
        onChange={handleAnswerText}
      />
      <Button className="pe-0 text-danger" variant="link">
        <Trash3 />
      </Button>
    </InputGroup>
  );
};

export default NewAnswer;
