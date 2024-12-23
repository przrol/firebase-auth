import React, { useContext, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./groupQuestions.styles.css";
import { formatNumber, updateDocument } from "../../firebase";
import { groupBy } from "../../helpers";

export default function GroupQuestions() {
  const [state] = useContext(QuizContext);

  const sortedQuestions = [...state.allQuestions].sort((a, b) => {
    return a.examTopicId - b.examTopicId; // Sort by the 'age' property in ascending order
    // For descending order, use 'b.age - a.age'
  });

  const groupedData = groupBy(state.allQuestions, "groupNumber");
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
      <Navigation />
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="text-center">
          <div>{`Edit Questions (${state.currentExamNumber})`}</div>
        </Card.Header>
        <Card.Body>
          <Form>
            {groupedData &&
              Object.keys(groupedData).map((key, index) => (
                <Row className="mb-3" key={index}>
                  <Col className="me-3">
                    <div>
                      <div className="d-flex justify-content-between">
                        <Form.Label>{`Group Number: ${key}`}</Form.Label>
                        <Form.Label>{`${groupedData[key].length} questions`}</Form.Label>
                      </div>

                      <Form.Select
                        multiple
                        // size="lg"
                        htmlSize={8}
                        onChange={handleChange}
                        value={selectedOptions}
                      >
                        {groupedData[key].map((option) => {
                          // const questionNumber = formatNumber(option.examTopicId);

                          return (
                            <option
                              key={option.examTopicId}
                              value={option.examTopicId}
                            >
                              {formatNumber(option.examTopicId)}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </div>
                  </Col>
                  {/* <Col xs={{ offset: 1 }}> */}
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
              ))}
          </Form>
        </Card.Body>
      </Card>
      <DarkMode />
    </>
  );
}
