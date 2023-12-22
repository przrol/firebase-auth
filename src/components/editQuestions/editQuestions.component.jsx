import React, { useContext, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import { PencilSquare, Trash3 } from "react-bootstrap-icons";
import ModalDialog from "../modal/modalDialog.component";

export default function EditQuestions() {
  const defaultAnswer = { checked: false, answerText: "" };
  const [answers, setAnswers] = useState([defaultAnswer]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useContext(QuizContext);
  const [show, setShow] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
    setShow(true);
  };

  const handleNewAnswer = () => {
    setAnswers((prevAnswers) => [...prevAnswers, defaultAnswer]);
  };

  const handleNewAnswerChange = (index, newText) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((element, i) => {
        return i === index ? { ...element, answerText: newText } : element;
      })
    );
  };

  const handleDeleteAnswer = (indexToRemove) => {
    setAnswers((prevAnswers) =>
      prevAnswers.filter((element, index) => index !== indexToRemove)
    );
  };

  const handleCheckboxChange = (index, checked) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((element, i) => {
        return i === index ? { ...element, checked } : element;
      })
    );
  };

  function handleSubmit(e) {
    e.preventDefault();

    // if (passwordRef.current.value !== passwordConfirmRef.current.value) {
    //   return setError("Password do not match");
    // }
    setLoading(true);
    setError("");
    setSuccess("");

    const correctAnswers = answers
      .filter((element) => element.checked)
      .map((answer) => answer.answerText);
    const incorrectAnswers = answers
      .filter((element) => !element.checked)
      .map((answer) => answer.answerText);
  }

  return (
    <>
      <Navigation />
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="text-center">Edit Question</Card.Header>
        <Card.Body>
          <Form>
            {state.questions.map((q, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>{`Question ${index + 1}`}</Form.Label>
                <Button
                  className="pt-0 ps-2 pb-2 text-primary"
                  variant="link"
                  title="Edit"
                  // onClick={() => {
                  //   onDeleteAnswer(index);
                  // }}
                >
                  <PencilSquare />
                </Button>
                <div className="d-flex align-items-center">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled
                    defaultValue={q.question}
                  />

                  <Button
                    className="pe-0 text-danger"
                    variant="link"
                    title="Delete answer"
                    onClick={() => handleShow(`Question ${index + 1}`)}
                  >
                    <Trash3 />
                  </Button>
                </div>
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
