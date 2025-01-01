import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";

export default function NewExamModal({ show, onCloseModal, onCreateExam }) {
  const examTitleRef = useRef();
  const examNumberRef = useRef();

  return (
    <>
      <Modal show={show} onHide={onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create new Exam</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Exam Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Azure AI Fundamentals"
                ref={examTitleRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Exam number</Form.Label>
              <Form.Control
                type="text"
                placeholder="AI-900"
                ref={examNumberRef}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              onCreateExam(
                examTitleRef.current.value,
                examNumberRef.current.value
              )
            }
          >
            OK
          </Button>
          <Button variant="secondary" onClick={onCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

NewExamModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onCreateExam: PropTypes.func.isRequired,
};
