import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { QuizContext } from "../contexts/QuizContext";

export default function Navigation() {
  const [error, setError] = useState("");
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [state] = useContext(QuizContext);

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("Failed to log out");
    }
  }

  return (
    <Navbar
      bg={state.isDarkMode ? "dark" : "light"}
      sticky="top"
      className="border-bottom mb-2"
      expand="sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Quiz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/update-profile">
                Update
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/signup">
                Sign Up
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Questions" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/addquestion">
                Add Single
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/editquestion">
                Edit Questions
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/groupquestion">
                Group Questions
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/editexam">
                Manage Exams
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/texttospeech">
                TextToSpeech
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex align-items-center">
            <div className="text-end">
              <Form.Label className="text-muted mb-0 fw-bold me-1">
                Signed in as:
              </Form.Label>
              <Form.Label className="text-muted mb-0">
                {currentUser.email}
              </Form.Label>
            </div>
            <Button variant="link" onClick={handleLogout}>
              Log Out
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
