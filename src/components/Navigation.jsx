import React, { useState } from "react";
import { Container, Navbar, Nav, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation() {
  const [error, setError] = useState("");
  const { logout } = useAuth();
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
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Quiz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/update-profile">
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/signup">
              Sign Up
            </Nav.Link>
          </Nav>
          <Form>
            <Button variant="link" onClick={handleLogout}>
              Log Out
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}