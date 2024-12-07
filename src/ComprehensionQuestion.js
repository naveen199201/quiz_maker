import React, { useState } from "react";
import "./ComprehensionQuestion.css";

const ComprehensionQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
}) => {
  const [paragraph, setParagraph] = useState(questionData.paragraph || "");
  const [questions, setQuestions] = useState(questionData.questions || []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: "",
        options: ["", "", "", ""],
        correctOption: null,
      },
    ]);
  };

  const updateQuestionText = (index, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  const updateOptionText = (qIndex, optionIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optionIndex] = text;
    setQuestions(updatedQuestions);
  };

  const updateCorrectOption = (qIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctOption = optionIndex;
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = questions[index];
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: questions.length + 1,
    };
    setQuestions([...questions, duplicatedQuestion]);
  };

  return (
    <div className="comprehension-question">
      <h3>Comprehension Question</h3>
      <textarea
        placeholder="Enter the paragraph here..."
        value={paragraph}
        onChange={(e) => setParagraph(e.target.value)}
        rows={5}
        className="paragraph-input"
      />

      <h4>Questions</h4>
      {questions.map((question, qIndex) => (
        <div key={question.id} className="question-block">
          <div className="question-header">
            <input
              type="text"
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              className="question-input"
            />
            <div className="question-actions">
              <button
                className="duplicate-question"
                onClick={() => duplicateQuestion(qIndex)}
              >
                Duplicate
              </button>
              <button
                className="delete-question"
                onClick={() => deleteQuestion(qIndex)}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="options-block">
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="option-row">
                <input
                  type="radio"
                  name={`correctOption-${qIndex}`}
                  checked={question.correctOption === oIndex}
                  onChange={() => updateCorrectOption(qIndex, oIndex)}
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    updateOptionText(qIndex, oIndex, e.target.value)
                  }
                  className="option-input"
                />
              </div>
            ))}
          </div>
          {question.correctOption !== null && (
            <p className="answer-display">
              Answer: {question.options[question.correctOption]}
            </p>
          )}
        </div>
      ))}

      <button className="add-question" onClick={addQuestion}>
        Add Question
      </button>
      <button
        onClick={() =>
          handleSave(questionIndex, {
            paragraph,
            questions,
          },"comprehension")
        }
      >
        Save Question
      </button>

      <button className="delete-question" onClick={onDelete}>
        Delete Question
      </button>
    </div>
  );
};

export default ComprehensionQuestion;
