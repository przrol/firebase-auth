import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { InputGroup, Row } from "react-bootstrap";
import NewAnswer from "./newAnswer/newAnswer.component";

export default function AddSingleQuestion() {
  const questionRef = useRef();
  const explanationRef = useRef();
  const defaultAnswer = { checked: false, answerText: "" };
  const [answers, setAnswers] = useState([
    { id: 0, checked: false, answerText: "aa" },
    { id: 1, checked: false, answerText: "ss" },
    { id: 2, checked: false, answerText: "dd" },
  ]);
  // const [correctAnswers, setCorrectAnswers] = useState([]);
  // const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const { currentUser, updateCurrentUserEmail, updateCurrentUserPassword } =
    useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      prevAnswers.filter((element) => element.id !== indexToRemove)
    );
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Password do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");
    setSuccess("");

    if (questionRef.current.value !== currentUser.email) {
      promises.push(updateCurrentUserEmail(questionRef.current.value));
    }

    if (passwordRef.current.value) {
      promises.push(updateCurrentUserPassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        // navigate("/");
        setSuccess("The update was successful");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Navigation />
      <Card className="mx-auto mt-1" bg="light" style={{ maxWidth: "800px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Add Single Question</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="singleQuestion" className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control as="textarea" rows={3} ref={questionRef} required />
            </Form.Group>
            <Form.Label>Answers</Form.Label>

            {answers.map((answer, index) => (
              <NewAnswer
                answerText={answer.answerText}
                key={index}
                index={answer.id}
                onDeleteAnswer={handleDeleteAnswer}
                onChangeAnswer={handleNewAnswerChange}
              />
            ))}

            <Button className="ps-1" variant="link" onClick={handleNewAnswer}>
              Add Answer
            </Button>

            <Form.Group id="explanation" className="mt-4 mb-3">
              <Form.Label>Explanation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="e.g. explanation of ChatGPT"
                ref={explanationRef}
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Add
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
}
