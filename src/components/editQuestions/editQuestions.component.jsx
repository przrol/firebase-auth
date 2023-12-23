import React, { useContext, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";
import ModalDialog from "../modal/modalDialog.component";
import "./editQuestions.styles.css";
import EditQuestion from "../editQuestion/editQuestion.component";

export default function EditQuestions() {
  const [state] = useContext(QuizContext);
  const [show, setShow] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
    setShow(true);
  };

  const handleShowExplanation = () => {
    setShowExplanation((prev) => !prev);
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
            {state.questions.map((q, index) => (
              <EditQuestion
                onShowDeleteModal={handleShow}
                key={index}
                index={index}
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
