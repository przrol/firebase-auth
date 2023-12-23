import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";

export default function EditQuestion({
  index,
  question,
  onShowDeleteModal,
  showAllExplanations,
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleShowExplanation = () => {
    setShowExplanation((prev) => !prev);
  };

  return (
    <>
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
        <Button
          className="my-2 me-3"
          variant="primary"
          onClick={handleShowExplanation}
        >
          Answers
        </Button>
        <Button
          className="my-2"
          variant="warning"
          onClick={handleShowExplanation}
        >
          Explanation
        </Button>
        {(showExplanation || showAllExplanations) && (
          <Form.Control
            as="textarea"
            rows={4}
            disabled
            defaultValue={question.explanation}
          />
        )}
        <hr className="mt-4"></hr>
      </Form.Group>
    </>
  );
}
