import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation() {
  const [error, setError] = useState("");
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

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
    <Navbar bg="dark" expand="sm" data-bs-theme="dark">
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
            <NavDropdown title="Learn" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/update-profile">
                Add Question
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex align-items-center">
            <div>
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
