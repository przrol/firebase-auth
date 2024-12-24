import { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { QuizContext } from "../contexts/QuizContext";
import { Check } from "react-bootstrap-icons";

export default function Navigation() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [state, dispatch] = useContext(QuizContext);
  const currentGroupNumber = state.currentGroupNumber.toString();
  // const uniqueGroupNumbers = [
  //   ...new Set(state.allQuestions.map((item) => item.groupNumber || 0)),
  // ].sort((a, b) => a - b);
  // console.log(uniqueGroupNumbers);

  const groupCounts = state.allQuestions.reduce((counts, item) => {
    const groupNumber = item.groupNumber || 0; // Use 0 as default
    counts[groupNumber] = (counts[groupNumber] || 0) + 1; // Increment count
    return counts;
  }, {});

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

  const handleGroupClick = (groupNumber) => {
    console.log("handleGroupClick run");
    dispatch({
      type: "UPDATE_CURRENT_GROUPNUMBER",
      groupNumber: parseInt(groupNumber),
    });
  };

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
            <NavDropdown title="Group number" id="basic-nav-dropdown">
              {Object.entries(groupCounts).map(
                ([groupNumber, count], index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={() => handleGroupClick(groupNumber)}
                  >
                    <Check
                      className="me-2"
                      visibility={
                        currentGroupNumber === groupNumber
                          ? "visible"
                          : "hidden"
                      }
                    />
                    {groupNumber === "0"
                      ? `All Qs (Count ${state.allQuestions.length})`
                      : `Grp ${groupNumber} (Count ${count})`}
                  </NavDropdown.Item>
                )
              )}
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
