import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <AuthProvider>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100">
          <Signup />
        </div>
      </Container>
    </AuthProvider>
  );
}

export default App;
