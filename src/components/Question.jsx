import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";
import { replaceWithBr } from "../helpers";
import Answer from "./Answer";

const Question = () => {
  const { reducer } = useContext(QuizContext);
  const [quizState, dispatch] = reducer;
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const questionWithBr = replaceWithBr(currentQuestion.question);

  return (
    <div>
      <div
        className="question"
        dangerouslySetInnerHTML={{ __html: questionWithBr }}
      />
      <div className="answers">
        {quizState.answers.map((answer, index) => (
          <Answer
            answerText={answer}
            key={index}
            index={index}
            currentAnswer={quizState.currentAnswer}
            correctAnswer={currentQuestion.correctAnswer}
            onSelectAnswer={(answerText) =>
              dispatch({ type: "SELECT_ANSWER", payload: answerText })
            }
          />
        ))}
      </div>
      <div
        className="next-button"
        onClick={() => dispatch({ type: "NEXT_QUESTION" })}
      >
        Nächste Frage
      </div>
      {quizState.showExplanation && (
        <div>
          <div className="explanation">
            <div>
              <p style={{ fontWeight: "bold" }}>Erklärung (ChatGPT)</p>
              <p
                dangerouslySetInnerHTML={{
                  __html: replaceWithBr(currentQuestion.explanationChatGPT),
                }}
              />
            </div>
          </div>

          <div
            className="explanation"
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(currentQuestion.explanationUdemy),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Question;
