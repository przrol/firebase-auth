import { useContext, useState } from "react";
import { Trash3, ArrowDownSquare, ArrowUpSquare } from "react-bootstrap-icons";
import { QuizContext } from "../../contexts/QuizContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./editExam.styles.css";
import { deleteCollection, exportCollectionAsJSON } from "../../firebase";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

export default function EditExam({
  examTitle,
  examNumber,
  index,
  onChangeRadio,
  checked,
  onImportClick,
}) {
  const [state, dispatch] = useContext(QuizContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleExport = async () => {
    await exportCollectionAsJSON(examNumber);
  };

  const handleDeleteExam = async () => {
    // Delete the exam
    await deleteCollection(examNumber);

    const examArray = state.examArray.filter(
      (exam) => exam.number !== examNumber
    );
    dispatch({ type: "GET_ALL_COLLECTIONS", examArray });

    handleClose();
  };

  return (
    <>
      <Row>
        <Col xs={7} className="exam-column d-flex align-items-center pe-0">
          <Form.Check
            className={`w-100 hover-border py-3 ${checked && "bg-success"}`}
            type="radio"
            checked={checked}
            label={`${examTitle} (${examNumber})`}
            id={`checkRadioExam-${index}`}
            onChange={(e) => {
              onChangeRadio(examNumber, e.target.checked);
            }}
          />
        </Col>
        <Col className="px-0 d-flex align-items-center justify-content-center">
          <Button
            className="import-button px-1"
            variant="link"
            title={`Import exam: ${examNumber}`}
            onClick={() => onImportClick(examNumber)}
          >
            <ArrowUpSquare size={24} />
          </Button>
        </Col>
        <Col className="px-0 d-flex align-items-center justify-content-center">
          <Button
            className="export-button px-1 text-secondary"
            variant="link"
            title={`Export exam: ${examNumber}`}
            onClick={handleExport}
          >
            <ArrowDownSquare size={24} />
          </Button>
        </Col>
        <Col className="px-0 d-flex align-items-center justify-content-center">
          <Button
            className="text-danger px-0"
            variant="link"
            title={`Delete exam: ${examNumber}`}
            onClick={handleShow}
          >
            <Trash3 size={24} />
          </Button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{`Delete Exam ${examTitle} (${examNumber})`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Do you really want to delete: Exam ${examTitle} (${examNumber})?`}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleDeleteExam}>
            OK
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

EditExam.propTypes = {
  examTitle: PropTypes.string.isRequired,
  examNumber: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onChangeRadio: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  onImportClick: PropTypes.func.isRequired,
};
