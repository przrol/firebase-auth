import { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import ModalDialog from "../modal/modalDialog.component";
import EditQuestion from "../editQuestion/editQuestion.component";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./editQuestions.styles.css";
import { deleteDocument, getExamQuestions } from "../../firebase";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";

export default function EditQuestions() {
  const [state, dispatch] = useContext(QuizContext);
  const [show, setShow] = useState(false);
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({});

  useEffect(() => {
    const reloadQuestions = async () => {
      const data = await getExamQuestions(state.currentExamNumber);
      dispatch({
        type: "RESTART",
        payload: data,
        onlyFailed: state.onlyFailed,
      });
    };

    reloadQuestions();
  }, [dispatch, state.currentExamNumber, state.onlyFailed]);

  const sortedQuestions = state.questionsSortedUpwards
    ? [...state.allQuestions].sort((a, b) => a.examTopicId - b.examTopicId)
    : [...state.allQuestions].sort((a, b) => b.examTopicId - a.examTopicId);

  const toggleSortDirection = () => {
    dispatch({
      type: "UPDATE_QUESTION_SORTING",
      sortedUpwards: !state.questionsSortedUpwards,
    });
  };

  const handleClose = () => setShow(false);

  const handleDeleteQuestion = async () => {
    await deleteDocument(state.currentExamNumber, currentQuestion);

    dispatch({
      type: "DELETE_QUESTION",
      currentQuestionId: currentQuestion.id,
    });

    handleClose();
  };

  const handleShow = (question) => {
    setCurrentQuestion(question);
    setShow(true);
  };

  const handleShowAllExplanations = () => {
    setShowAllExplanations((prev) => !prev);
  };

  const handleShowAllAnswers = () => {
    setShowAllAnswers((prev) => !prev);
  };

  return (
    <>
      <Navigation />
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="d-flex align-items-center">
          <div className="flex-grow-1 text-center">{`Edit ${state.allQuestions.length} Questions (${state.currentExamNumber})`}</div>
          <Button
            variant="link"
            title="change question order"
            onClick={toggleSortDirection}
          >
            {state.questionsSortedUpwards ? (
              <ArrowUp fill="white" />
            ) : (
              <ArrowDown fill="white" />
            )}
          </Button>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-4">
              <Col className="d-flex">
                <Form.Check
                  className="me-3"
                  type="checkbox"
                  id="show-All-Answers"
                  label={"Show all answers"}
                  onClick={handleShowAllAnswers}
                />
                <Form.Check
                  type="checkbox"
                  id="show-All-Explanations"
                  label={"Show all explanations"}
                  onClick={handleShowAllExplanations}
                />
              </Col>
            </Row>
            {sortedQuestions.map((q) => (
              <EditQuestion
                onShowDeleteModal={handleShow}
                key={q.examTopicId}
                showAllExplanations={showAllExplanations}
                showAllAnswers={showAllAnswers}
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
        onDeleteQuestion={handleDeleteQuestion}
        modalTitle={`Delete Question ${currentQuestion?.examTopicId}`}
        modalBody={`Do you really want to delete: Question ${currentQuestion?.examTopicId}?`}
      />
    </>
  );
}
