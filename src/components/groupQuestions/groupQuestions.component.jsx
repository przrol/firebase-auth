import { useContext } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import DarkMode from "../darkMode/darkMode.component";
import { QuizContext } from "../../contexts/QuizContext";
import Navigation from "../Navigation";
import "./groupQuestions.styles.css";
import { groupBy } from "../../helpers";
import GroupQuestion from "../groupQuestion/groupQuestion.component";

export default function GroupQuestions() {
  const [state] = useContext(QuizContext);
  const groupedData = groupBy(state.allQuestions, "groupNumber");

  return (
    <>
      <Navigation />
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="text-center">
          <div>{`Edit Questions (${state.currentExamNumber})`}</div>
        </Card.Header>
        <Card.Body>
          <Form>
            {groupedData &&
              Object.keys(groupedData).map((key, index) => (
                <GroupQuestion
                  key={index}
                  groupedData={groupedData[key]}
                  groupKey={key}
                />
              ))}
          </Form>
        </Card.Body>
      </Card>
      <DarkMode />
    </>
  );
}
