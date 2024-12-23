import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import ModalDialog from "../modal/modalDialog.component";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./groupQuestions.styles.css";
import { formatNumber } from "../../firebase";

export default function GroupQuestions() {
  const [state] = useContext(QuizContext);

  const sortedQuestions = [...state.allQuestions].sort((a, b) => {
    return a.examTopicId - b.examTopicId; // Sort by the 'age' property in ascending order
    // For descending order, use 'b.age - a.age'
  });

  const [show, setShow] = useState(false);
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
    setShow(true);
  };

  const handleShowAllExplanations = () => {
    setShowAllExplanations((prev) => !prev);
  };

  const handleShowAllAnswers = () => {
    setShowAllAnswers((prev) => !prev);
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selected);
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
            <Row className="mb-4">
              <Col className="d-flex">
                <Form.Check
                  className="me-3"
                  type="checkbox"
                  id="show-All-Answers"
                  label={"Show all answers"}
                  onClick={handleShowAllAnswers}
                />
                <Form.Check
                  type="checkbox"
                  id="show-All-Explanations"
                  label={"Show all explanations"}
                  onClick={handleShowAllExplanations}
                />
              </Col>
            </Row>
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
                  {sortedQuestions.map((option) => (
                    <option key={option.examTopicId} value={option.examTopicId}>
                      {/* {`Question_${option.examTopicId}`} */}
                      {formatNumber(option.examTopicId)}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Move to Group</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Group number"
                    defaultValue={0}
                  />
                </Form.Group>
                <Button variant="primary">Move</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <DarkMode />
    </>
  );
}
