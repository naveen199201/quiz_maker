import React, { useState } from "react";
import FormHeader from "./FormHeader";
import QuestionTypeSelector from "./QuestionTypeSelector";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CategorizeQuestion from "./CategorizeQuestion";
import ClozeQuestion from "./ClozeQuestion";
import ComprehensionQuestion from "./ComprehensionQuestion";
import FormPreview from "./FormPreview";
import axios from "axios";

const baseUrl = "https://backend-eight-virid-92.vercel.app/api/questions";
const FormEditor = () => {
  const [clozeQuestions, setClozeQuestions] = useState([]);
  const [categorizeQuestions, setCategorizeQuestions] = useState([]);
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);

  const addQuestion = (type) => {
    switch (type) {
      case "cloze": {
        const updatedQuestions = [
          ...clozeQuestions,
          { questionText: "", underlinedWords: [], answerText: "" },
        ];
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        const updatedQuestions = [
          ...categorizeQuestions,
          { categories: [], answers: [] },
        ];
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        const updatedQuestions = [
          ...comprehensionQuestions,
          { paragraph: "", questions: [] },
        ];
        setComprehensionQuestions(updatedQuestions);
        break;
      }
      default: {
        console.error("Unknown question type:", type);
        break;
      }
    }
  };
  const handleDeleteQuestion = (type, index) => {
    switch (type) {
      case "cloze": {
        const updatedQuestions = clozeQuestions.filter((_, i) => i !== index);
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        const updatedQuestions = categorizeQuestions.filter(
          (_, i) => i !== index
        );
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        const updatedQuestions = comprehensionQuestions.filter(
          (_, i) => i !== index
        );
        setComprehensionQuestions(updatedQuestions);
        break;
      }
      default: {
        console.error("Unknown question type:", type);
        break;
      }
    }
  };
  const handleSubmitQuestions = () => {
    let postData = {
      clozeQuestions,
      categorizeQuestions,
      comprehensionQuestions,
    };
    axios.post(baseUrl, postData);
  };

  const handleSaveQuestion = (index, questionData, type) => {
    switch (type) {
      case "cloze": {
        let updatedQuestions = [...clozeQuestions];
        updatedQuestions[index] = questionData;
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        let updatedQuestions = [...categorizeQuestions];
        updatedQuestions[index] = questionData;
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        let updatedQuestions = [...comprehensionQuestions];
        updatedQuestions[index] = questionData;
        setComprehensionQuestions(updatedQuestions);
        break;
      }
      default: {
        console.error("Unknown question type:", type);
        break;
      }
    }
  };

  return (
    <div className="form-editor">
      <FormHeader />
      <QuestionTypeSelector onAddQuestion={addQuestion} />
      <DndProvider backend={HTML5Backend}>
        {categorizeQuestions.map((question, index) => {
          return (
            <CategorizeQuestion
              key={index}
              questionIndex={index}
              questionData={question}
              handleSave={() =>
                handleSaveQuestion(index, question, "categorize")
              }
              onDelete={() => handleDeleteQuestion(index, "categorize")}
            />
          );
        })}
        {clozeQuestions.map((question, index) => {
          return (
            <ClozeQuestion
              key={index}
              questionIndex={index}
              questionData={question}
              handleSave={() => handleSaveQuestion(index, question, "cloze")}
              onDelete={() => handleDeleteQuestion(index, "cloze")}
            />
          );
        })}
        {comprehensionQuestions.map((question, index) => {
          return (
            <ComprehensionQuestion
              key={index}
              questionIndex={index}
              questionData={question}
              handleSave={() =>
                handleSaveQuestion(index, question, "comprehension")
              }
              onDelete={() => handleDeleteQuestion(index, "comprehension")}
            />
          );
        })}
      </DndProvider>
      {/* <FormPreview questions={questions} /> */}
      <button onClick={handleSubmitQuestions}>Submit</button>
    </div>
  );
};

export default FormEditor;