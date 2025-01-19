import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "./answerDropdown.styles.css";
import PropTypes from "prop-types";

export default function AnswerDropdown({
  quizState,
  currentQuestion,
  index,
  dispatch,
  currentQuestionIndex,
}) {
  //   const [selectedItem, setSelectedItem] = useState("Select an item");
  const selectedItem =
    quizState.currentAnswers.length - 1 < index
      ? "Select an item"
      : quizState.currentAnswers[index][0];

  const correctAnswer = currentQuestion.correctAnswers[index][0];
  const isCorrectAnswer = selectedItem === correctAnswer;

  // Function to handle the selection
  const handleSelect = (eventKey) => {
    // setSelectedItem(eventKey);
    dispatch({
      type: "SELECT_ANSWER",
      payload: eventKey,
      index,
      checked: true,
      currentQuestionIndex,
    });
  };

  return (
    <>
      <DropdownButton
        size="sm"
        onSelect={handleSelect}
        className="d-inline-flex mx-2 mb-1"
        id={`dropdown-basic-button${index + 1}`}
        title={selectedItem}
        variant={
          quizState.solveQuestion
            ? isCorrectAnswer
              ? "success"
              : "danger"
            : "primary"
        }
      >
        {quizState.answers[index].map((answer, i) => (
          <React.Fragment key={`answer-${i}`}>
            <Dropdown.Item className="question-dropdown-item" eventKey={answer}>
              {answer}
            </Dropdown.Item>
            <Dropdown.Divider key={`divider-${i}`} />
          </React.Fragment>
        ))}
      </DropdownButton>
      {quizState.solveQuestion && !isCorrectAnswer && (
        <span className="fw-bold text-success">{correctAnswer}</span>
      )}
    </>
  );
}

AnswerDropdown.propTypes = {
  quizState: PropTypes.object.isRequired,
  currentQuestion: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
};
