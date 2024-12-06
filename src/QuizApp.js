import React, { useState } from "react";
import FormEditor from "./FormEditor";
import QuizForm from "./QuizForm";

const QuizApp = () => {
  const [activeTab, setActiveTab] = useState("formEditor");
  const [questions, setQuestions] = useState([]); // Shared state for questions

  const handleQuestionsUpdate = (updatedQuestions) => {
    setQuestions(updatedQuestions);
  };

  return (
    <div className="tabbed-quiz-app">
      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className={activeTab === "formEditor" ? "active" : ""}
          onClick={() => setActiveTab("formEditor")}
        >
          Form Editor
        </button>
        <button
          className={activeTab === "quiz" ? "active" : ""}
          onClick={() => setActiveTab("quiz")}
        >
          Student Quiz
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "formEditor" && (
          <FormEditor
            questions={questions}
            onQuestionsChange={handleQuestionsUpdate}
          />
        )}
        {activeTab === "quiz" && <QuizForm questions={questions} />}
      </div>
    </div>
  );
};

export default QuizApp;
