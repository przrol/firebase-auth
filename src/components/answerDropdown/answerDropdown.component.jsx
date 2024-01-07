import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function AnswerDropdown({ answers, index }) {
  const [selectedItem, setSelectedItem] = useState("Select an item");

  // Function to handle the selection
  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  return (
    <DropdownButton
      size="sm"
      onSelect={handleSelect}
      className="d-inline"
      id={`dropdown-basic-button${index + 1}`}
      title={selectedItem}
    >
      {answers.map((answer, i) => (
        <Dropdown.Item key={i} eventKey={answer}>
          {answer}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
