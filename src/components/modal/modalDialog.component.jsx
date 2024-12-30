import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

export default function ModalDialog({
  show,
  onCloseModal,
  modalTitle,
  modalBody,
  onDeleteQuestion,
}) {
  return (
    <>
      <Modal show={show} onHide={onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onDeleteQuestion}>
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

ModalDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalBody: PropTypes.node.isRequired,
  onDeleteQuestion: PropTypes.func.isRequired,
};
