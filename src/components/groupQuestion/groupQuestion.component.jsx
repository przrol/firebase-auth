import React, { useContext, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./groupQuestion.styles.css";
import { formatNumber, updateDocument } from "../../firebase";

export default function GroupQuestion() {
  const [state] = useContext(QuizContext);

  const sortedQuestions = [...state.allQuestions].sort((a, b) => {
    return a.examTopicId - b.examTopicId; // Sort by the 'age' property in ascending order
    // For descending order, use 'b.age - a.age'
  });

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
    });
  };

  return (
    <>
      <Row>
        <Col>
          <Form.Label>{`Question count: ${sortedQuestions.length}`}</Form.Label>
          <Form.Select
            multiple
            // size="lg"
            htmlSize={8}
            onChange={handleChange}
            value={selectedOptions}
          >
            {sortedQuestions.map((option) => {
              // const questionNumber = formatNumber(option.examTopicId);

              return (
                <option key={option.examTopicId} value={option.examTopicId}>
                  {formatNumber(option.examTopicId)}
                </option>
              );
            })}
          </Form.Select>
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
