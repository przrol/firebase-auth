import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";
import { replaceWithBr, getGermanFormattedTime } from "../../helpers";
import PropTypes from "prop-types";

export default function EditQuestion({
  index,
  question,
  onShowDeleteModal,
  showAllExplanations,
  showAllAnswers,
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const lastModifiedObj = getGermanFormattedTime(question?.lastModified);

  useEffect(() => {
    setShowExplanation(showAllExplanations);
  }, [showAllExplanations]);

  useEffect(() => {
    setShowAnswers(showAllAnswers);
  }, [showAllAnswers]);

  let allAnswers = [];

  for (let index = 0; index < question.correctAnswers.length; index++) {
    const correctAnswers = question.correctAnswers[index].map((element) => ({
      checked: true,
      answerText: element,
    }));
    const incorrectAnswers = question.incorrectAnswers[index].map(
      (element) => ({
        checked: false,
        answerText: element,
      })
    );

    allAnswers.push([...correctAnswers, ...incorrectAnswers]);
  }

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
          <Form.Label className="ms-1">
            {`Question #${question.examTopicId}`}
          </Form.Label>
          <Link to={question.id}>
            <PencilSquare className="ms-2 me-3 editIcon" />
          </Link>
          <Form.Label
            className={`fw-bold ${
              question.groupNumber % 2 === 0 ? "text-primary" : "text-warning"
            }`}
          >{`Group ${question.groupNumber}`}</Form.Label>
        </div>
        <div>
          <Form.Label className="ms-1">
            {`(Last Modified:`}
            <span
              title={lastModifiedObj.tooltip}
              className={
                lastModifiedObj.text === "no change date"
                  ? "text-danger-emphasis"
                  : "text-success"
              }
            >{` ${lastModifiedObj.text}`}</span>
            {")"}
          </Form.Label>
          <Button
            className="pt-0 deleteButton pe-2 text-danger"
            variant="link"
            title="Delete answer"
            onClick={() => onShowDeleteModal(question)}
          >
            <Trash3 />
          </Button>
        </div>
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
        allAnswers.map((answerblock, blockindex) => (
          <Form.Group key={blockindex} className="mb-3">
            <Form.Label>{`Answer block ${blockindex + 1}`}</Form.Label>

            {answerblock.map((answer, index) => (
              <InputGroup
                key={index}
                id={`answerText-${index}`}
                className="mb-3"
              >
                <InputGroup.Checkbox checked={answer.checked} disabled />
                <Form.Control
                  as="textarea"
                  rows={2}
                  defaultValue={answer.answerText}
                  disabled
                />
              </InputGroup>
            ))}
          </Form.Group>
        ))}
      {showExplanation && (
        <div
          dangerouslySetInnerHTML={{
            __html: replaceWithBr(
              question.explanation || "No explanation available!"
            ),
          }}
        ></div>
      )}
      <hr className="mt-4"></hr>
    </Form.Group>
  );
}

EditQuestion.propTypes = {
  index: PropTypes.number.isRequired,
  question: PropTypes.shape({
    examTopicId: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    lastModified: PropTypes.string,
    question: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    questionBelowImg: PropTypes.string,
    correctAnswers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
      .isRequired,
    incorrectAnswers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
      .isRequired,
    explanation: PropTypes.string,
    groupNumber: PropTypes.number,
  }).isRequired,
  onShowDeleteModal: PropTypes.func.isRequired,
  showAllExplanations: PropTypes.bool.isRequired,
  showAllAnswers: PropTypes.bool.isRequired,
};
