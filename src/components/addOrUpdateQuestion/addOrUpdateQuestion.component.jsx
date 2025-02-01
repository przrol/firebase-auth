import { useContext, useEffect, useRef, useState } from "react";
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
import {
  addNewDocument,
  addNewImage,
  deleteStorageFile,
  updateDocument,
} from "../../firebase";
import { QuizContext } from "../../contexts/QuizContext";
import DarkMode from "../darkMode/darkMode.component";
import "./addOrUpdateQuestion.styles.css";
import { Trash3, Stickies } from "react-bootstrap-icons";
import { getGermanFormattedTime, getHighestExamTopicId } from "../../helpers";

export default function AddOrUpdateQuestion() {
  const { questionId } = useParams();
  const [state, dispatch] = useContext(QuizContext);

  if (questionId) {
    const editQuestion = state.allQuestions.find((q) => q.id === questionId);
    if (editQuestion) {
      initializeForm(editQuestion);
      setCurrentQuestion(editQuestion);
    }
  } else {
    const newExamTopicId = getHighestExamTopicId(state.allQuestions) + 1;
    const defaultGroupNumber = Math.floor(newExamTopicId / 20) + 1;
    // resetForm(newExamTopicId, defaultGroupNumber);
  }

  const questionRef = useRef("");

  const [examTopicId, setExamTopicId] = useState(0);
  const [groupNumber, setGroupNumber] = useState(0);
  // const examTopicIdRef = useRef(examTopicId);
  // const groupNumberRef = useRef(groupNumber);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const questionBelowImgRef = useRef();
  const answerAreaRef = useRef();
  const explanationRef = useRef();
  const defaultAnswer = { checked: false, answerText: "" };
  const [answers, setAnswers] = useState([[defaultAnswer]]);
  const answersRef = useRef(answers); // <- ADDED THIS
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const [isExamTopicIdInvalid, setIsExamTopicIdInvalid] = useState(false);
  const [isGroupNumberInvalid, setIsGroupNumberInvalid] = useState(false);
  const [isQuestionInvalid, setIsQuestionInvalid] = useState(false);
  const [isCheckboxInvalid, setIsCheckboxInvalid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lastModified, setLastModified] = useState({});
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(15);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  useEffect(() => {
    let intervalId;

    intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          // Reset the timer when it reaches 0
          handleTimerComplete();
          return 15;
        }
      });
    }, 1000);

    // Cleanup function: This is important to prevent memory leaks!
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array: This effect runs only once on component mount

  // useEffect(() => {
  //   examTopicIdRef.current = examTopicId;
  // }, [examTopicId]);

  // useEffect(() => {
  //   groupNumberRef.current = groupNumber;
  // }, [groupNumber]);

  // useEffect(() => {
  // Extract this to a separate function for clarity
  const initializeForm = (question) => {
    questionRef.current.value = question.question;
    questionBelowImgRef.current.value = question.questionBelowImg ?? "";
    answerAreaRef.current.value = question.answerArea ?? "";
    explanationRef.current.value = question.explanation;

    // Transform answers
    const allAnswers = question.correctAnswers.map((correctAns, index) => {
      const correct = correctAns.map((text) => ({
        checked: true,
        answerText: text,
      }));
      const incorrect = question.incorrectAnswers[index].map((text) => ({
        checked: false,
        answerText: text,
      }));
      return [...correct, ...incorrect];
    });

    setAnswers(allAnswers);
    setImageUrl(question.imageUrl);
    setExamTopicId(question.examTopicId);
    setGroupNumber(question.groupNumber ?? "1");

    const lastModifiedObj = getGermanFormattedTime(question.lastModified);
    setLastModified(lastModifiedObj);
  };

  const resetForm = (defaultExamTopicId, defaultGroupNumber) => {
    questionRef.current = "";
    questionBelowImgRef.current = "";
    explanationRef.current = "";
    answerAreaRef.current = "";
    setAnswers([[defaultAnswer]]);
    setImageUrl("");
    setExamTopicId(defaultExamTopicId);
    setGroupNumber(defaultGroupNumber);
  };

  // }, [questionId, state.questions]); // Added state.questions as dependency

  const handleTimerComplete = async () => {
    if (questionId) {
      const correctAnswers = answersRef.current // <- USE REF HERE
        .map((answerBlock) =>
          answerBlock
            .filter((element) => element.checked)
            .map((answer) => answer.answerText)
        )
        .filter((block) => block.length > 0); // Filter out empty sub-arrays
      const editQuestion = state.allQuestions.find((q) => q.id === questionId);

      // const currentExamTopicId = examTopicIdRef.current;
      // const currentGroupNumber = groupNumberRef.current;
      const currentExamTopicId = examTopicId;
      const currentGroupNumber = groupNumber;

      if (
        (correctAnswers.length === answersRef.current.length &&
          currentExamTopicId !== 0 &&
          currentGroupNumber !== 0 &&
          currentExamTopicId !== editQuestion.examTopicId) ||
        currentGroupNumber !== editQuestion.groupNumber ||
        questionRef.current.value !== "" ||
        questionRef.current.value !== editQuestion.question ||
        questionBelowImgRef.current.value !== editQuestion.questionBelowImg ||
        answerAreaRef.current.value !== editQuestion.explanation ||
        explanationRef.current.value !== editQuestion.explanation
      ) {
        const incorrectAnswers = answersRef.current.map((answerBlock) =>
          answerBlock
            .filter((element) => !element.checked)
            .map((answer) => answer.answerText)
        );

        const newImageUrl = await updateImage();

        const newLastModifiedDate = new Date();
        const newLastModified = newLastModifiedDate.toISOString();

        await updateDocument(
          state.currentExamNumber,
          questionId,
          questionRef.current.value,
          questionBelowImgRef.current.value,
          correctAnswers,
          incorrectAnswers,
          explanationRef.current.value,
          newImageUrl,
          currentExamTopicId,
          answerAreaRef.current.value,
          newLastModified,
          currentGroupNumber
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
          currentExamTopicId,
          answerArea: answerAreaRef.current.value,
          newLastModified,
          currentGroupNumber,
        });

        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Berlin",
        };
        const formattedTime = newLastModifiedDate.toLocaleString(
          "de-DE",
          timeOptions
        );

        setSuccess(
          `The question was successfully ${`updated in '${state.currentExamNumber}' at ${formattedTime}`}`
        );
      } else {
        setSuccess("");
      }
    }
  };

  const handleNewAnswerBlock = () => {
    setAnswers((prevAnswers) => {
      answersRef.current = [...prevAnswers, [defaultAnswer]];
      return [...prevAnswers, [defaultAnswer]];
    });
  };

  const handleNewAnswer = (blockindex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = prevAnswers.map((answerBlock, index) => {
        if (index === blockindex) {
          return [...answerBlock, defaultAnswer];
        }
        return answerBlock;
      });
      answersRef.current = newAnswers;
      return newAnswers;
    });
  };

  const handleNewAnswerChange = (blockindex, index, newText) => {
    setAnswers((prevAnswers) => {
      const newAnswers = prevAnswers.map((answerBlock, idx) => {
        if (idx === blockindex) {
          return answerBlock.map((element, i) => {
            return i === index ? { ...element, answerText: newText } : element;
          });
        } else {
          return answerBlock;
        }
      });
      answersRef.current = newAnswers;
      return newAnswers;
    });
  };
  const handleDeleteAnswerBlock = (blockindexToRemove) => {
    setAnswers((prevAnswers) => {
      const newAnswers = prevAnswers.filter(
        (element, index) => index !== blockindexToRemove
      );
      answersRef.current = newAnswers;
      return newAnswers;
    });
  };

  const handleDuplicateAnswerBlock = (blockindex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [
        ...prevAnswers.slice(0, blockindex + 1),
        prevAnswers[blockindex],
        ...prevAnswers.slice(blockindex + 1),
      ];
      answersRef.current = newAnswers;
      return newAnswers;
    });
  };
  const handleDeleteAnswer = (blockindex, indexToRemove) => {
    setAnswers((prevAnswers) => {
      const newAnswers = prevAnswers.reduce((newAnswers, currentBlock, idx) => {
        if (idx === blockindex) {
          const updatedBlock = currentBlock.filter(
            (_, index) => index !== indexToRemove
          );
          if (updatedBlock.length > 0) {
            newAnswers.push(updatedBlock);
          }
        } else {
          newAnswers.push(currentBlock);
        }
        return newAnswers;
      }, []);
      answersRef.current = newAnswers;
      return newAnswers;
    });
  };

  const handleCheckboxChange = (blockindex, index, checked) => {
    setAnswers((prevAnswers) => {
      const newAnswers = prevAnswers.map((answerBlock, idx) => {
        if (idx === blockindex) {
          return answerBlock.map((element, i) => {
            return i === index ? { ...element, checked } : element;
          });
        } else {
          return answerBlock;
        }
      });
      answersRef.current = newAnswers;
      return newAnswers;
    });
  };
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  const scrollToTop = () => {
    // For scrolling to the top of the page
    window.scrollTo({
      top: 0, // Scroll to the top of the window
      behavior: "smooth", // For a smooth scroll
    });
  };

  const updateImage = async () => {
    let newImageUrl = currentQuestion ? currentQuestion.imageUrl : "";

    if (selectedImageFile) {
      newImageUrl = await addNewImage(
        state.currentExamNumber,
        questionId,
        examTopicId,
        selectedImageFile
      );

      setSelectedImageFile(null);
      fileInputRef.current.value = null;
      setImageUrl(newImageUrl);
      deleteStorageFile(currentQuestion?.imageUrl);
    } else if (!imageUrl && currentQuestion?.imageUrl) {
      deleteStorageFile(currentQuestion.imageUrl);
      newImageUrl = "";
    }

    return newImageUrl;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    setLoading(true);
    setError("");
    setSuccess("");

    const correctAnswers = answersRef.current // <- USE REF HERE
      .map((answerBlock) =>
        answerBlock
          .filter((element) => element.checked)
          .map((answer) => answer.answerText)
      )
      .filter((block) => block.length > 0); // Filter out empty sub-arrays

    setIsExamTopicIdInvalid(examTopicId === 0 || examTopicId === "");
    setIsGroupNumberInvalid(groupNumber === 0 || groupNumber === "");
    setIsQuestionInvalid(questionRef.current.value === "");
    setIsCheckboxInvalid(correctAnswers.length < answersRef.current.length); // USE REF HERE

    try {
      if (
        correctAnswers.length === answersRef.current.length && // USE REF HERE
        examTopicId !== 0 &&
        questionRef.current.value !== ""
      ) {
        const incorrectAnswers = answersRef.current.map((answerBlock) =>
          answerBlock
            .filter((element) => !element.checked)
            .map((answer) => answer.answerText)
        );

        const newImageUrl = await updateImage();

        const newLastModifiedDate = new Date();
        const newLastModified = newLastModifiedDate.toISOString();

        if (questionId) {
          await updateDocument(
            state.currentExamNumber,
            questionId,
            questionRef.current.value,
            questionBelowImgRef.current.value,
            correctAnswers,
            incorrectAnswers,
            explanationRef.current.value,
            newImageUrl,
            examTopicId,
            answerAreaRef.current.value,
            newLastModified,
            groupNumber
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
            answerArea: answerAreaRef.current.value,
            newLastModified,
            groupNumber,
          });
        } else {
          const newDocId = await addNewDocument(
            state.currentExamNumber,
            questionRef.current.value,
            questionBelowImgRef.current.value,
            correctAnswers,
            incorrectAnswers,
            explanationRef.current.value,
            newImageUrl,
            examTopicId,
            answerAreaRef.current.value,
            newLastModified,
            groupNumber
          );

          dispatch({
            type: "ADD_QUESTION",
            newQuestion: {
              id: newDocId,
              question: questionRef.current.value,
              questionBelowImg: questionBelowImgRef.current.value,
              correctAnswers,
              incorrectAnswers,
              explanation: explanationRef.current.value,
              imageUrl: newImageUrl,
              examTopicId,
              answerArea: answerAreaRef.current.value,
              lastModified: newLastModified,
              groupNumber,
            },
          });

          questionRef.current.value = "";
          questionBelowImgRef.current.value = "";
          explanationRef.current.value = "";
          answerAreaRef.current.value = "";
          setAnswers([[defaultAnswer]]);
          setImageUrl("");
          setExamTopicId(0);
          setGroupNumber(0);
          handleDeleteImg();
        }

        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Berlin",
        };
        const formattedTime = newLastModifiedDate.toLocaleString(
          "de-DE",
          timeOptions
        );

        setSuccess(
          `The question was successfully ${
            questionId
              ? `updated in '${state.currentExamNumber}' at ${formattedTime}`
              : `added at ${formattedTime}`
          }`
        );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);

      if (
        correctAnswers.length < answersRef.current.length &&
        examTopicId !== 0 &&
        questionRef.current.value !== ""
      ) {
        answerAreaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        scrollToTop();
      }
    }
  }

  const insertAtCursor = (textToInsert) => {
    const textarea = answerAreaRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    const beforeText = textarea.value.substring(0, startPos);
    const afterText = textarea.value.substring(endPos, textarea.value.length);

    textarea.value = beforeText + textToInsert + afterText;
    textarea.selectionStart = startPos + textToInsert.length;
    textarea.selectionEnd = startPos + textToInsert.length;

    // After inserting the text, you might want to set the focus back to the textarea
    textarea.focus();
  };

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

  const handleChangeImage = async () => {
    // Get a reference to the selected file
    const file = fileInputRef.current.files[0];
    setSelectedImageFile(file);

    if (file) {
      // Optional: display preview or perform other file validation
      // Example: using FileReader to preview image
      const reader = new FileReader();
      // e.target.result contains the Data URL which can be used as a source of the image
      reader.onload = (e) => setImageUrl(e.target.result);
      // Read the file as a Data URL
      reader.readAsDataURL(file);
    }
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
        <Card.Header className="d-flex justify-content-between align-items-center sticky-top-custom bg-body-secondary">
          <div>{seconds < 10 ? `0${seconds}` : seconds}s</div>
          <div className="flex-grow-1 text-center">{`${
            questionId
              ? `Edit Question #${examTopicId} / Grp ${groupNumber}`
              : "Add Single Question"
          } (${state.currentExamNumber})`}</div>
          <div
            className={
              lastModified.text === "no change date"
                ? "text-danger-emphasis"
                : "text-success"
            }
            title={lastModified.tooltip}
          >
            {lastModified.text}
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ExamTopics ID</Form.Label>
              <Form.Control
                value={examTopicId}
                onChange={(e) => setExamTopicId(parseInt(e.target.value) || "")}
                type="number"
                required
                isInvalid={isExamTopicIdInvalid}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an ExamTopics ID.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Group number</Form.Label>
              <Form.Control
                value={groupNumber}
                onChange={(e) => setGroupNumber(parseInt(e.target.value) || "")}
                type="number"
                required
                isInvalid={isGroupNumberInvalid}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Group number.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group id="singleQuestion" className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={7}
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
            <Form.Group className="mb-3">
              <Form.Label>Answer Area</Form.Label>
              <Button
                size="sm"
                title="Insert Dropdown"
                onClick={() => insertAtCursor("_dropdown_")}
                className="mb-2 ms-3 fw-bold fs-6 py-1"
              >
                D
              </Button>
              <Button
                size="sm"
                variant="light"
                title="Insert Space"
                onClick={() => insertAtCursor("  ")}
                className="mb-2 mx-3 fw-bold fs-6 py-1"
              >
                S
              </Button>
              <Form.Control
                as="textarea"
                className="mb-3"
                rows={8}
                ref={answerAreaRef}
              />
            </Form.Group>

            {answers.map((answerblock, blockindex) => (
              <Form.Group key={blockindex} className="mb-3">
                <Form.Label>{`Answer block ${blockindex + 1}`}</Form.Label>
                <Button
                  className="pe-1 mb-2 text-primary"
                  variant="link"
                  title="Copy answers block"
                  onClick={() => {
                    handleDuplicateAnswerBlock(blockindex);
                  }}
                >
                  <Stickies />
                </Button>
                <Button
                  className="pe-0 mb-2 text-danger"
                  variant="link"
                  title="Delete answers block"
                  onClick={() => {
                    handleDeleteAnswerBlock(blockindex);
                  }}
                >
                  <Trash3 />
                </Button>
                {answerblock.map((answer, index) => (
                  <NewAnswer
                    answerText={answer.answerText}
                    blockindex={blockindex}
                    key={index}
                    index={index}
                    checked={answer.checked}
                    onDeleteAnswer={handleDeleteAnswer}
                    onChangeAnswer={handleNewAnswerChange}
                    onChangeCheckbox={handleCheckboxChange}
                    isLastAnswer={index === answerblock.length - 1}
                    isCheckboxInvalid={isCheckboxInvalid}
                  />
                ))}
                <Button
                  className="ps-1"
                  variant="link"
                  onClick={() => handleNewAnswer(blockindex)}
                >
                  Add Answer
                </Button>
              </Form.Group>
            ))}
            <Button
              className="ps-1"
              variant="link"
              onClick={handleNewAnswerBlock}
            >
              Add Answer block
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
                rows={14}
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
