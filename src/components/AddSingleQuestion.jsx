import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Link, useParams } from "react-router-dom";
import Navigation from "./Navigation";
import NewAnswer from "./newAnswer/newAnswer.component";
import {
  addNewDocument,
  getQuestionsAndDocuments,
  updateDocument,
} from "../firebase";
import { QuizContext } from "../contexts/QuizContext";
import DarkMode from "./darkMode/darkMode.component";
import { TypeBold } from "react-bootstrap-icons";

export default function AddSingleQuestion() {
  const { questionId } = useParams();
  const [state, dispatch] = useContext(QuizContext);
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

  const scrollToTop = () => {
    // For scrolling to the top of the page
    window.scrollTo({
      top: 0, // Scroll to the top of the window
      behavior: "smooth", // For a smooth scroll
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const correctAnswers = answers
        .filter((element) => element.checked)
        .map((answer) => answer.answerText);

      if (correctAnswers.length === 0) {
        setError("mark at least one answer as correct");
      } else {
        const incorrectAnswers = answers
          .filter((element) => !element.checked)
          .map((answer) => answer.answerText);

        if (questionId) {
          await updateDocument(
            questionId,
            questionRef.current.value,
            correctAnswers,
            incorrectAnswers,
            explanationRef.current.value
          );
        } else {
          await addNewDocument(
            questionRef.current.value,
            correctAnswers,
            incorrectAnswers,
            explanationRef.current.value
          );

          questionRef.current.value = "";
          explanationRef.current.value = "";
          setAnswers([defaultAnswer]);
        }

        setSuccess(
          `The question was successful ${questionId ? "updated" : "added"}!`
        );

        getQuestionsAndDocuments().then((data) =>
          dispatch({ type: "RESTART", payload: data })
        );
      }
    } catch (error) {
      setError(e.message);
    } finally {
      setLoading(false);
      scrollToTop();
    }
  }

  const replaceSelectedText = (htmlTag) => {
    const textArea = explanationRef.current;
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;
    if (startPos !== endPos) {
      // Only proceed if there's a selection
      const newText = `${textArea.value.substring(
        0,
        startPos
      )}<${htmlTag}>${textArea.value.substring(
        startPos,
        endPos
      )}</${htmlTag}>${textArea.value.substring(endPos)}`;

      textArea.value = newText;

      // Update the selection to be at the end of the replaced text
      const newCaretPosition = endPos + 2 * (htmlTag.length + 2) + 1;
      textArea.focus();
      textArea.setSelectionRange(startPos, newCaretPosition);
    }
  };

  const replaceSelectedTextWithAnker = () => {
    const textArea = explanationRef.current;
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;
    if (startPos !== endPos) {
      // Only proceed if there's a selection
      const newText = `${textArea.value.substring(
        0,
        startPos
      )}<a target="_blank" href="${textArea.value.substring(
        startPos,
        endPos
      )}">${textArea.value.substring(
        startPos,
        endPos
      )}</a>${textArea.value.substring(endPos)}`;

      textArea.value = newText;

      // Update the selection to be at the end of the replaced text
      // const newCaretPosition = endPos + 2 * (htmlTag.length + 2) + 1;
      // textArea.focus();
      // textArea.setSelectionRange(startPos, newCaretPosition);
    }
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
              <Button
                title="Bold"
                onClick={() => replaceSelectedText("strong")}
                className="mb-2 ms-2 fw-bold fs-6 py-1"
              >
                B
              </Button>
              <Button
                size="sm"
                variant="warning"
                title="Highlight"
                onClick={() => replaceSelectedText("mark")}
                className="mb-2 mx-3 fw-bold fs-6 py-1"
              >
                H
              </Button>
              <Button
                size="sm"
                variant="success"
                title="Anker"
                onClick={() => replaceSelectedTextWithAnker()}
                className="mb-2 fw-bold fs-6 py-1"
              >
                A
              </Button>
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
