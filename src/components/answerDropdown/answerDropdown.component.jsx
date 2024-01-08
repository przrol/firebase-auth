import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function AnswerDropdown({ quizState, index, dispatch }) {
  //   const [selectedItem, setSelectedItem] = useState("Select an item");
  const selectedItem =
    quizState.currentAnswers.length - 1 < index
      ? "Select an item"
      : quizState.currentAnswers[index][0];

  // Function to handle the selection
  const handleSelect = (eventKey) => {
    // setSelectedItem(eventKey);
    dispatch({
      type: "SELECT_ANSWER",
      payload: eventKey,
      index,
      checked: true,
    });
  };

  return (
    <DropdownButton
      size="sm"
      onSelect={handleSelect}
      className="d-inline"
      id={`dropdown-basic-button${index + 1}`}
      title={selectedItem}
    >
      {quizState.answers[index].map((answer, i) => (
        <Dropdown.Item key={i} eventKey={answer}>
          {answer}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
