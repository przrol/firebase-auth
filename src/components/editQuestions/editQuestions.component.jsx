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

export default function EditQuestions() {
  const [state] = useContext(QuizContext);
  const [show, setShow] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
    setShow(true);
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
              <Form.Group key={index} className="mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <Form.Label className="ms-1">{`Question ${
                      index + 1
                    }`}</Form.Label>
                    <Link to={q.id}>
                      <PencilSquare className="ms-2 editIcon" />
                    </Link>
                  </div>
                  <Button
                    className="pt-0 deleteButton pe-2 text-danger"
                    variant="link"
                    title="Delete answer"
                    onClick={() => handleShow(`Question ${index + 1}`)}
                  >
                    <Trash3 />
                  </Button>
                </div>
                {/* <div className="d-flex align-items-center"> */}
                <Form.Control
                  as="textarea"
                  rows={3}
                  disabled
                  defaultValue={q.question}
                />
                {/* </div> */}
                <Button className="my-2" variant="warning">
                  Explanation
                </Button>
                <Form.Control
                  as="textarea"
                  rows={4}
                  disabled
                  defaultValue={q.explanation}
                />
                <hr className="mt-4"></hr>
              </Form.Group>
            ))}
          </Form>
        </Card.Body>
      </Card>
      <DarkMode />
      <ModalDialog
        show={show}
        onCloseModal={handleClose}
        question={currentQuestionIndex}
        modalTitle={`Delete ${currentQuestionIndex}`}
        modalBody={`Do you really want to delete: ${currentQuestionIndex}?`}
      />
    </>
  );
}
