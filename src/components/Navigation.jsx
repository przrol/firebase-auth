import React from "react";
import { Container, Navbar } from "react-bootstrap";

export default function Navigation() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Quiz</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
