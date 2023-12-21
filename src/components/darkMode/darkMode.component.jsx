import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Moon, Sun } from "react-bootstrap-icons";
import { QuizContext } from "../../contexts/QuizContext";

export default function DarkMode() {
  const { reducer } = useContext(QuizContext);
  const [state, dispatch] = reducer;

  return (
    <Row className="mt-3">
      <Col className="d-flex align-items-center justify-content-center">
        <p
          //   style={{ width: "150px" }}
          className={`${
            state.isDarkMode ? "bg-dark" : "bg-light"
          } py-1 border rounded-4 d-flex justify-content-center`}
        >
          <Button
            className="rounded-4 px-4 mx-1 d-flex align-items-center"
            type="button"
            variant={state.isDarkMode ? "info" : "light"}
            onClick={() =>
              dispatch({
                type: "DARK_MODE",
                isDarkMode: true,
              })
            }
          >
            <Moon />
          </Button>
          <Button
            className="rounded-4 px-4 me-1 d-flex align-items-center"
            type="button"
            variant={state.isDarkMode ? "dark" : "info"}
            onClick={() =>
              dispatch({
                type: "DARK_MODE",
                isDarkMode: false,
              })
            }
          >
            <Sun />
          </Button>
        </p>
      </Col>
    </Row>
  );
}
