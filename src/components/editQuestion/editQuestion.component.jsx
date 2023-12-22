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

export default function EditQuestion() {
  const defaultAnswer = { checked: false, answerText: "" };
  const [answers, setAnswers] = useState([defaultAnswer]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [state] = useContext(QuizContext);

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
                <div className="d-flex">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled
                    defaultValue={q.question}
                  />
                  <div style={{ maxWidth: "35px" }}>
                    <Button
                      className="pe-0 text-primary"
                      variant="link"
                      title="Edit"
                      // onClick={() => {
                      //   onDeleteAnswer(index);
                      // }}
                    >
                      <PencilSquare />
                    </Button>
                    <Button
                      className="pe-0 text-danger"
                      variant="link"
                      title="Delete answer"
                      // onClick={() => {
                      //   onDeleteAnswer(index);
                      // }}
                    >
                      <Trash3 />
                    </Button>
                  </div>
                </div>
              </Form.Group>
            ))}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
