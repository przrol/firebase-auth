import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Link, useParams } from "react-router-dom";
import Navigation from "./Navigation";
import NewAnswer from "./newAnswer/newAnswer.component";
import { addNewDocument, getQuestionsAndDocuments } from "../firebase";
import { QuizContext } from "../contexts/QuizContext";
import DarkMode from "./darkMode/darkMode.component";

export default function AddSingleQuestion() {
  const { questionId } = useParams();
  const [state] = useContext(QuizContext);
  let questionRef = useRef();
  let explanationRef = useRef();
  const defaultAnswer = { checked: false, answerText: "" };
  const [answers, setAnswers] = useState([defaultAnswer]);

  useEffect(() => {
    if (questionId) {
      const editQuestion = state.questions.find((q) => q.id === questionId);
      questionRef.current.value = editQuestion.question;
      explanationRef.current.value = editQuestion.explanation;
      const incorrectAnswers = editQuestion.incorrectAnswers.map((element) => ({
        checked: false,
        answerText: element,
      }));
      const correctAnswers = editQuestion.correctAnswers.map((element) => ({
        checked: true,
        answerText: element,
      }));
      setAnswers([...correctAnswers, ...incorrectAnswers]);
    } else {
      questionRef.current.value = "";
      explanationRef.current.value = "";
      setAnswers([defaultAnswer]); // Reset answers to default
    }
  }, [questionId]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    addNewDocument(
      questionRef.current.value,
      correctAnswers,
      incorrectAnswers,
      explanationRef.current.value
    )
      .then(() => {
        setSuccess("The question was successful added");
        questionRef.current.value = "";
        explanationRef.current.value = "";
        setAnswers([defaultAnswer]);

        getQuestionsAndDocuments().then((data) =>
          dispatch({ type: "RESTART", payload: data })
        );
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Navigation />
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="text-center">
          {questionId ? "Edit Question" : "Add Single Question"}
        </Card.Header>
        <Card.Body>
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
                index={index}
                checked={answer.checked}
                onDeleteAnswer={handleDeleteAnswer}
                onChangeAnswer={handleNewAnswerChange}
                onChangeCheckbox={handleCheckboxChange}
                isLastAnswer={index === answers.length - 1}
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
              {questionId ? "Update" : "Add"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
      <DarkMode />
    </>
  );
}
