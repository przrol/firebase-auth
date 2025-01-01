import { useContext, useRef, useState } from "react";
import Navigation from "../Navigation";
import { QuizContext } from "../../contexts/QuizContext";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import DarkMode from "../darkMode/darkMode.component";
import EditExam from "../editExam/editExam.component";
import { addNewCollection, importDataToFirestore } from "../../firebase";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NewExamModal from "../modal/newExamModal.component";

export default function EditExams() {
  const [state, dispatch] = useContext(QuizContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);
  const [importExamName, setImportExamName] = useState("");
  const hiddenFileInput = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreateExam = async (examNumber, examTitle) => {
    console.log("Create new exam: ", examNumber, examTitle);

    await addNewCollection(examNumber, examTitle);

    dispatch({
      type: "GET_ALL_COLLECTIONS",
      examArray: [...state.examArray, { number: examNumber, title: examTitle }],
    });

    setShow(false);
  };

  const handleImportClick = (collectionName) => {
    setImportExamName(collectionName);
    hiddenFileInput.current.click(); // Trigger the hidden input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const content = e.target.result;
        const jsonContent = JSON.parse(content); // Parse the file content to JSON
        importDataToFirestore(jsonContent, importExamName)
          .then(() =>
            setSuccess(`File successfully imported to '${importExamName}'`)
          )
          .catch((error) => {
            console.error(error.message);
            setError(error.message);
          });
      };
      reader.readAsText(file);
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
        <Card.Header className="text-center">Edit Exams</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form>
            {state.examArray.map((exam, index) => (
              <EditExam
                examTitle={exam.title}
                examNumber={exam.number}
                key={index}
                index={index}
                checked={state.currentExamNumber === exam.number}
                onImportClick={handleImportClick}
                onChangeRadio={(examNumber, checked) => {
                  dispatch({
                    type: "SELECT_EXAM",
                    payload: examNumber,
                    checked,
                  });
                  setSuccess(`Exam '${examNumber}' selected`);
                }}
              />
            ))}
            <Row className="mt-4">
              <Col xs={7} className="ms-1">
                <Button
                  className="w-100"
                  variant="primary"
                  onClick={handleShow}
                >
                  Add new Exam
                </Button>
              </Col>
            </Row>
          </Form>
          <input
            hidden
            type="file"
            ref={hiddenFileInput}
            onChange={handleFileChange}
          />
        </Card.Body>
      </Card>

      <DarkMode />
      <NewExamModal
        show={show}
        onCloseModal={handleClose}
        onCreateExam={handleCreateExam}
      />
    </>
  );
}
