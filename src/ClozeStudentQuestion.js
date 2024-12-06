import React from "react";

const ClozeStudentQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="cloze-question">
      <p>{question.data.text.replace(/__\d+__/g, (match) => `[${match}]`)}</p>
      {question.data.options.map((option, index) => (
        <div key={index}>
          <label>Fill in the blank {index + 1}:</label>
          <input
            type="text"
            value={answer[index] || ""}
            onChange={(e) =>
              onAnswerChange({ ...answer, [index]: e.target.value })
            }
          />
        </div>
      ))}
    </div>
  );
};

export default ClozeStudentQuestion;
