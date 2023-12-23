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
  const [show, setShow] = useState(false);
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
    setShow(true);
  };

  const handleShowAllExplanations = () => {
    setShowAllExplanations((prev) => !prev);
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
            <Row className="mb-3">
              <Col className="d-flex">
                <Form.Check
                  className="me-4"
                  type="checkbox"
                  id="show-All-Explanations"
                  label={"Show all explanations"}
                  onClick={handleShowAllExplanations}
                />
                <Form.Check
                  type="checkbox"
                  id="show-All-Answers"
                  label={"Show all answers"}
                />
              </Col>
            </Row>
            {state.questions.map((q, index) => (
              <EditQuestion
                onShowDeleteModal={handleShow}
                key={index}
                index={index}
                showAllExplanations={showAllExplanations}
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
