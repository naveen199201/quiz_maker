import React from "react";

const ComprehensionStudentQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="comprehension-question">
      <p>{question.data.paragraph}</p>
      {question.data.mcqs.map((mcq, index) => (
        <div key={index} className="mcq">
          <p>{mcq.question}</p>
          {mcq.options.map((option, optionIndex) => (
            <div key={optionIndex} className="option">
              <input
                type="radio"
                id={`q${index}_o${optionIndex}`}
                name={`q${index}`}
                value={option}
                checked={answer[index] === option}
                onChange={() => onAnswerChange({ ...answer, [index]: option })}
              />
              <label htmlFor={`q${index}_o${optionIndex}`}>{option}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ComprehensionStudentQuestion;
