import { AuthProvider } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Signup from "./Signup";
import Container from "react-bootstrap/Container";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import Quiz from "./quiz/quiz.component";
import { QuizProvider } from "../contexts/QuizContext";
import EditQuestions from "./editQuestions/editQuestions.component";
import AddOrUpdateQuestion from "./addOrUpdateQuestion/addOrUpdateQuestion.component";
import EditExams from "./editExams/editExams.component";
import TextToSpeech from "./textToSpeech/textToSpeech.component";

function App() {
  return (
    <Container style={{ minHeight: "100vh" }}>
      <div>
        <BrowserRouter>
          <AuthProvider>
            <QuizProvider>
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Quiz />} />
                  <Route
                    path="editquestion/:questionId"
                    element={<AddOrUpdateQuestion />}
                  />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/update-profile" element={<UpdateProfile />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/signup" element={<Signup />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route
                    path="/addquestion"
                    element={<AddOrUpdateQuestion />}
                  />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/editexam" element={<EditExams />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/editquestion" element={<EditQuestions />} />
                </Route>
                {/* <Route element={<PrivateRoute />}>
                  <Route
                    path="/editquestion/:questionId"
                    element={<AddOrUpdateQuestion />}
                  />
                </Route> */}
                <Route element={<PrivateRoute />}>
                  <Route path="/texttospeech" element={<TextToSpeech />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
            </QuizProvider>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </Container>
  );
}

export default App;
