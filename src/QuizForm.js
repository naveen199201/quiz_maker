import React, { useState } from "react";

const QuizForm = ({ questions }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Your answers have been submitted!");
  };

  return (
    <div className="student-quiz">
      <h1>Quiz</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {questions.map((question, index) => (
          <div key={question.id} className="question-section">
            <h3>Question {index + 1}</h3>
            {question.type === "Categorize" && (
              <CategorizeStudentQuestion
                question={question}
                answer={answers[question.id] || {}}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question.id, answer)
                }
              />
            )}
            {question.type === "Cloze" && (
              <ClozeStudentQuestion
                question={question}
                answer={answers[question.id] || ""}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question.id, answer)
                }
              />
            )}
            {question.type === "Comprehension" && (
              <ComprehensionStudentQuestion
                question={question}
                answer={answers[question.id] || {}}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question.id, answer)
                }
              />
            )}
          </div>
        ))}
        <button type="button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
