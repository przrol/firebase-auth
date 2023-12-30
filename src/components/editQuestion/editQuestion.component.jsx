import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";

export default function EditQuestion({
  index,
  question,
  onShowDeleteModal,
  showAllExplanations,
  showAllAnswers,
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    setShowExplanation(showAllExplanations);
  }, [showAllExplanations]);

  useEffect(() => {
    setShowAnswers(showAllAnswers);
  }, [showAllAnswers]);

  const incorrectAnswers = question.incorrectAnswers.map((element) => ({
    checked: false,
    answerText: element,
  }));
  const correctAnswers = question.correctAnswers.map((element) => ({
    checked: true,
    answerText: element,
  }));

  const allAnswers = [...correctAnswers, ...incorrectAnswers];

  const handleShowExplanation = () => {
    setShowExplanation((prev) => !prev);
  };

  const handleShowAnswers = () => {
    setShowAnswers((prev) => !prev);
  };

  return (
    <Form.Group className="mb-3">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <Form.Label className="ms-1">{`Question ${index + 1}`}</Form.Label>
          <Link to={question.id}>
            <PencilSquare className="ms-2 editIcon" />
          </Link>
        </div>
        <Button
          className="pt-0 deleteButton pe-2 text-danger"
          variant="link"
          title="Delete answer"
          onClick={() => onShowDeleteModal(`Question ${index + 1}`)}
        >
          <Trash3 />
        </Button>
      </div>
      <Form.Control
        as="textarea"
        rows={3}
        disabled
        defaultValue={question.question}
      />
      {question.imageUrl && (
        <Image className="mt-2" src={question.imageUrl} fluid />
      )}
      {question.questionBelowImg && (
        <Form.Control
          className="mt-2"
          as="textarea"
          rows={2}
          disabled
          defaultValue={question.questionBelowImg}
        />
      )}
      <Button
        className="mt-3 mb-2 me-3"
        variant="primary"
        onClick={handleShowAnswers}
      >
        Answers
      </Button>
      <Button
        className="mt-3 mb-2"
        variant="warning"
        onClick={handleShowExplanation}
      >
        Explanation
      </Button>
      {showAnswers &&
        allAnswers.map((answer, index) => (
          <InputGroup key={index} id={`answerText-${index}`} className="mb-3">
            <InputGroup.Checkbox checked={answer.checked} disabled />
            <Form.Control
              as="textarea"
              rows={2}
              defaultValue={answer.answerText}
              disabled
            />
          </InputGroup>
        ))}
      {showExplanation && (
        <Form.Control
          as="textarea"
          rows={4}
          disabled
          defaultValue={question.explanation}
        />
      )}
      <hr className="mt-4"></hr>
    </Form.Group>
  );
}
