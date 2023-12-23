import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ModalDialog({
  show,
  onCloseModal,
  modalTitle,
  modalBody,
}) {
  return (
    <>
      <Modal show={show} onHide={onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onCloseModal}>
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
