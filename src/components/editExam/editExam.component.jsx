import React from "react";
import { Trash3, ArrowDownSquare, ArrowUpSquare } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./editExam.styles.css";
import { exportCollectionAsJSON } from "../../firebase";

export default function EditExam({
  examTitle,
  examNumber,
  index,
  onChangeRadio,
  checked,
  onImportClick,
}) {
  const handleExport = async () => {
    await exportCollectionAsJSON(examNumber);
  };
  return (
    <Row>
      <Col xs={7} className="exam-column d-flex align-items-center pe-0">
        <Form.Check
          className="w-100 hover-border py-3"
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
          onClick={() => {}}
        >
          <Trash3 size={24} />
        </Button>
      </Col>
    </Row>
  );
}
