import { useContext, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { QuizContext } from "../../contexts/QuizContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./groupQuestion.styles.css";
import { formatNumber, updateDocument } from "../../firebase";
import PropTypes from "prop-types";

export default function GroupQuestion({ groupedData, groupKey }) {
  const [state, dispatch] = useContext(QuizContext);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const groupNumberRef = useRef();

  const handleChange = (event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    console.log(selected);
    setSelectedOptions(selected);
  };

  const handleMove = () => {
    const groupNumber = Number(groupNumberRef.current.value);

    selectedOptions.forEach(async (option) => {
      const question = state.allQuestions.find(
        (q) => q.examTopicId === parseInt(option)
      );

      await updateDocument(
        state.currentExamNumber,
        question.id,
        question.question,
        question.questionBelowImg,
        question.correctAnswers,
        question.incorrectAnswers,
        question.explanation,
        question.imageUrl,
        question.examTopicId,
        question.answerArea,
        question.lastModified,
        groupNumber
      );

      dispatch({
        type: "UPDATE_QUESTION_GROUPNUMBERS",
        selectedOptions,
        groupNumber,
      });
    });
  };

  return (
    <>
      <Row className="mb-3">
        <Col className="me-3">
          <div>
            <div className="d-flex justify-content-between">
              <Form.Label>{`Group Number: ${groupKey}`}</Form.Label>
              <Form.Label>{`${groupedData.length} questions`}</Form.Label>
            </div>

            <Form.Select
              multiple
              // size="lg"
              htmlSize={8}
              onChange={handleChange}
              value={selectedOptions}
            >
              {groupedData.map((option) => (
                <option key={option.examTopicId} value={option.examTopicId}>
                  {formatNumber(option.examTopicId)}
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formMoveToGroup">
            <Form.Label>Move to Group</Form.Label>
            <Form.Control
              type="number"
              placeholder="Group number"
              defaultValue={0}
              className="question-group-input"
              ref={groupNumberRef}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleMove}>
            Move
          </Button>
        </Col>
      </Row>
    </>
  );
}

GroupQuestion.propTypes = {
  groupedData: PropTypes.array.isRequired,
  groupKey: PropTypes.string.isRequired,
};
