import React, { useState } from "react";
import CategorizeStudentQuestion from "./CategorizeStudentQuestion";
import ClozeStudentQuestionWrapper from "./ClozeStudentQuestion";
import ComprehensionStudentQuestion from "./ComprehensionStudentQuestion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import "./QuizForm.css";

const QuizForm = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const baseUrl = "http://localhost:5000/api/submissions";
  const handleAnswerChange = (question, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    axios.post(baseUrl, { 'data': answers });
    alert("Your answers have been submitted!");
  };
  return (
    <div className="student-quiz">
      <h1>Quiz</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Categorize Questions */}
        <div>
          {questions.categorizeQuestions.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Question {index+1}</h3>
              <CategorizeStudentQuestion
                question={question}
                answer={answers[question._id] || {}}
                onAnswerChange={handleAnswerChange}
              />
            </div>
          ))}
        </div>

        {/* Cloze Questions */}
        <div>
          {questions.clozeQuestions.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Question {index+1}</h3>
              <DndProvider backend={HTML5Backend}>
                <ClozeStudentQuestionWrapper
                  question={question}
                  answer={answers[question._id] || ""}
                  onAnswerChange={(answer) =>
                    handleAnswerChange(question._id, answer)
                  }
                />
              </DndProvider>
            </div>
          ))}
        </div>

        {/* Comprehension Questions */}
        <div>
          {questions.comprehensionQuestions.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Question {index + 1}</h3>
              <ComprehensionStudentQuestion
                question={question}
                answer={answers[question._id] || {}}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question._id, answer)
                }
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
