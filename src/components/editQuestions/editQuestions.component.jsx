import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import ModalDialog from "../modal/modalDialog.component";
import EditQuestion from "../editQuestion/editQuestion.component";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./editQuestions.styles.css";

export default function EditQuestions() {
  const [state] = useContext(QuizContext);

  const sortedQuestions = [...state.questions].sort((a, b) => {
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

  return (
    <>
      <Navigation />
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="text-center">Edit Questions</Card.Header>
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
            {sortedQuestions.map((q, index) => (
              <EditQuestion
                onShowDeleteModal={handleShow}
                key={index}
                index={index}
                showAllExplanations={showAllExplanations}
                showAllAnswers={showAllAnswers}
                question={q}
              />
            ))}
          </Form>
        </Card.Body>
      </Card>
      <DarkMode />
      <ModalDialog
        show={show}
        onCloseModal={handleClose}
        modalTitle={`Delete ${currentQuestionIndex}`}
        modalBody={`Do you really want to delete: ${currentQuestionIndex}?`}
      />
    </>
  );
}
