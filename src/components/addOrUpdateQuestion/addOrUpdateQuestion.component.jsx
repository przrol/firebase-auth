import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Link, useParams } from "react-router-dom";
import Navigation from "../Navigation";
import NewAnswer from "../newAnswer/newAnswer.component";
import { addNewDocument, addNewImage, updateDocument } from "../../firebase";
import { QuizContext } from "../../contexts/QuizContext";
import DarkMode from "../darkMode/darkMode.component";
import "./addOrUpdateQuestion.styles.css";
import { Trash3 } from "react-bootstrap-icons";

export default function AddOrUpdateQuestion() {
  const { questionId } = useParams();
  const [state, dispatch] = useContext(QuizContext);
  const questionRef = useRef();
  const examTopicIdRef = useRef();
  const questionBelowImgRef = useRef();
  const explanationRef = useRef();
  const answersLabelRef = useRef();
  const defaultAnswer = { checked: false, answerText: "" };
  const [answers, setAnswers] = useState([defaultAnswer]);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const [isExamTopicIdInvalid, setIsExamTopicIdInvalid] = useState(false);
  const [isQuestionInvalid, setIsQuestionInvalid] = useState(false);
  const [isCheckboxInvalid, setIsCheckboxInvalid] = useState(false);

  useEffect(() => {
    if (questionId) {
      const editQuestion = state.questions.find((q) => q.id === questionId);
      questionRef.current.value = editQuestion.question;
      examTopicIdRef.current.value = editQuestion.examTopicId;
      questionBelowImgRef.current.value = editQuestion.questionBelowImg ?? "";
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
      setImageUrl(editQuestion.imageUrl);
    } else {
      questionRef.current.value = "";
      examTopicIdRef.current.value = "";
      questionBelowImgRef.current.value = "";
      explanationRef.current.value = "";
      setAnswers([defaultAnswer]); // Reset answers to default
      setImageUrl("");
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

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   setValidated(true);
    //   return;
    // }

    setLoading(true);
    setError("");
    setSuccess("");

    const correctAnswers = answers
      .filter((element) => element.checked)
      .map((answer) => answer.answerText);

    setIsExamTopicIdInvalid(examTopicIdRef.current.value === "");
    setIsQuestionInvalid(questionRef.current.value === "");
    setIsCheckboxInvalid(correctAnswers.length === 0);

    try {
      if (
        correctAnswers.length > 0 &&
        examTopicIdRef.current.value !== "" &&
        questionRef.current.value !== ""
      ) {
        const incorrectAnswers = answers
          .filter((element) => !element.checked)
          .map((answer) => answer.answerText);

        const examTopicId = Number(examTopicIdRef.current.value);
        let newImageUrl = imageUrl ?? "";

        if (questionId) {
          if (fileInputRef.current && fileInputRef.current.files.length > 0) {
            const file = fileInputRef.current.files[0];

            newImageUrl = await addNewImage(file);
          }

          await updateDocument(
            questionId,
            questionRef.current.value,
            questionBelowImgRef.current.value,
            correctAnswers,
            incorrectAnswers,
            explanationRef.current.value,
            newImageUrl,
            examTopicId
          );

          dispatch({
            type: "UPDATE_QUESTION",
            questionId,
            question: questionRef.current.value,
            questionBelowImg: questionBelowImgRef.current.value,
            correctAnswers,
            incorrectAnswers,
            explanation: explanationRef.current.value,
            imageUrl: newImageUrl,
            examTopicId,
          });
        } else {
          const newDocRef = await addNewDocument(
            questionRef.current.value,
            questionBelowImgRef.current.value,
            correctAnswers,
            incorrectAnswers,
            explanationRef.current.value,
            newImageUrl,
            examTopicId
          );

          dispatch({
            type: "ADD_QUESTION",
            newQuestion: {
              id: newDocRef.id,
              question: questionRef.current.value,
              questionBelowImg: questionBelowImgRef.current.value,
              correctAnswers,
              incorrectAnswers,
              explanation: explanationRef.current.value,
              imageUrl: newImageUrl,
              examTopicId,
            },
          });

          questionRef.current.value = "";
          examTopicIdRef.current.value = "";
          questionBelowImgRef.current.value = "";
          explanationRef.current.value = "";
          setAnswers([defaultAnswer]);
          handleDeleteImg();
        }

        setSuccess(
          `The question was successful ${questionId ? "updated" : "added"}!`
        );

        // getQuestionsAndDocuments().then((data) =>
        //   dispatch({ type: "RESTART", payload: data })
        // );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);

      if (
        error ||
        examTopicIdRef.current.value === "" ||
        questionRef.current.value === "" ||
        success
      ) {
        scrollToTop();
      } else if (correctAnswers.length === 0) {
        answersLabelRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
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
    }
  };

  const handleChangeImage = async (event) => {
    // Get a reference to the selected file
    const file = fileInputRef.current.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      // e.target.result contains the Data URL which can be used as a source of the image
      setImageUrl(e.target.result);
    };

    // Read the file as a Data URL
    reader.readAsDataURL(file);
  };

  const handleDeleteImg = () => {
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ExamTopics ID</Form.Label>
              <Form.Control
                ref={examTopicIdRef}
                required
                isInvalid={isExamTopicIdInvalid}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an ExamTopics ID.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group id="singleQuestion" className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                ref={questionRef}
                required
                isInvalid={isQuestionInvalid}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Question.
              </Form.Control.Feedback>
            </Form.Group>
            {imageUrl && (
              <InputGroup as={Row}>
                <div className="d-flex mb-2">
                  <Image className="question-img" src={imageUrl} fluid />
                  <Button
                    className="ps-2 text-danger"
                    variant="link"
                    title="Delete answer"
                    onClick={() => {
                      handleDeleteImg(imageUrl);
                    }}
                  >
                    <Trash3 />
                  </Button>
                </div>
              </InputGroup>
            )}
            <Form.Group controlId="formFile" className="mb-3 file-upload">
              <Form.Label>Image file</Form.Label>
              <Form.Control
                type="file"
                size="sm"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={handleChangeImage}
                ref={fileInputRef}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Question Below Image</Form.Label>
              <Form.Control
                as="textarea"
                className="mb-3"
                rows={3}
                ref={questionBelowImgRef}
              />
            </Form.Group>
            <Form.Label ref={answersLabelRef}>Answers</Form.Label>

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
                isCheckboxInvalid={isCheckboxInvalid}
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
                variant="light"
                title="Italic"
                onClick={() => replaceSelectedText("em")}
                className="mb-2 ms-3 fw-bold fs-6"
                id="italic-button"
              >
                I
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
