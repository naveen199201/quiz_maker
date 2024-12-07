import React, { useState } from "react";

const QuizForm = ({ questions }) => {
  const [items, setitems] = useState({});

  const handleAnswerChange = (questionId, answer) => {
    setitems((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted items:", items);
    alert("Your items have been submitted!");
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
                answer={items[question.id] || {}}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question.id, answer)
                }
              />
            )}
            {question.type === "Cloze" && (
              <ClozeStudentQuestion
                question={question}
                answer={items[question.id] || ""}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question.id, answer)
                }
              />
            )}
            {question.type === "Comprehension" && (
              <ComprehensionStudentQuestion
                question={question}
                answer={items[question.id] || {}}
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
