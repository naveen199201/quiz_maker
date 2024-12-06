import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "draft-js/dist/Draft.css";
import "./ClozeQuestion.css";

const TextEditor = ({ editorState, setEditorState, toggleUnderline }) => (
  <div className="text-editor">
    <div className="toolbar">
      <button onClick={toggleUnderline}>Underline</button>
    </div>
    <div className="editor-container">
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Type your text here..."
      />
    </div>
  </div>
);

// Draggable Option Component
const DraggableOption = ({ word, index, moveOption, deleteOption }) => {
  const [, drag] = useDrag({
    type: "OPTION",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "OPTION",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveOption(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="option">
      {word}
      <button className="delete-option" onClick={() => deleteOption(index)}>
        x
      </button>
    </div>
  );
};

const ClozeQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [underlinedWords, setUnderlinedWords] = useState(
    questionData.underlinedWords || []
  );
  const [questionText, setQuestionText] = useState(
    questionData.questionText || ""
  );
  const [answerText, setAnswerText] = useState(questionData.answerText || "");

  useEffect(() => {
    // Initialize local state when props change
    setUnderlinedWords(questionData.underlinedWords || []);
    setQuestionText(questionData.questionText || "");
    setAnswerText(questionData.answerText || "");
  }, [questionData]);

  // Function to apply underline
  const toggleUnderline = () => {
    const newEditorState = RichUtils.toggleInlineStyle(
      editorState,
      "UNDERLINE"
    );
    setEditorState(newEditorState);
    extractUnderlinedWords(newEditorState);
  };

  // Extract underlined words and update preview text
  const extractUnderlinedWords = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const newUnderlinedWords = [];
    let updatedPreviewText = rawContent.blocks
      .map((block) => {
        let currentIndex = 0;
        let blockPreview = "";

        block.inlineStyleRanges.forEach((styleRange) => {
          if (styleRange.style === "UNDERLINE") {
            if (styleRange.offset > currentIndex) {
              blockPreview += block.text.substring(
                currentIndex,
                styleRange.offset
              );
            }

            blockPreview += " ______ ";
            const word = block.text.substring(
              styleRange.offset,
              styleRange.offset + styleRange.length
            );
            newUnderlinedWords.push(word);

            currentIndex = styleRange.offset + styleRange.length;
          }
        });

        if (currentIndex < block.text.length) {
          blockPreview += block.text.substring(currentIndex);
        }

        return blockPreview;
      })
      .join("\n");

    setUnderlinedWords(Array.from(new Set(newUnderlinedWords)));
    setQuestionText(updatedPreviewText);
    setAnswerText(contentState.getPlainText());
  };

  // Update editor state and preview text dynamically
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    setQuestionText(plainText); // Update preview text with plain text
    extractUnderlinedWords(newEditorState); // Update underlined words
  };

  // Move option (drag and drop)
  const moveOption = (fromIndex, toIndex) => {
    const updatedWords = [...underlinedWords];
    const [movedWord] = updatedWords.splice(fromIndex, 1);
    updatedWords.splice(toIndex, 0, movedWord);
    setUnderlinedWords(updatedWords);
  };

  // Delete an option
  const deleteOption = (index) => {
    const updatedWords = underlinedWords.filter((_, i) => i !== index);
    setUnderlinedWords(updatedWords);
  };

  return (
    <div className="cloze-question">
      <h3>Cloze Question</h3>

      {/* Text Editor Section */}
      <TextEditor
        editorState={editorState}
        setEditorState={handleEditorChange}
        toggleUnderline={toggleUnderline}
        multiLine={false}
      />

      {/* Question Input Box */}
      <div className="question-section">
        <h4>Question</h4>
        <input
          type="text"
          value={questionText}
          readOnly
          className="preview-textbox"
          placeholder="Question will appear here..."
        />
      </div>

      {/* Options Section */}
      <DndProvider backend={HTML5Backend}>
        <div className="options-section">
          <h4>Options</h4>
          {underlinedWords.length > 0 ? (
            underlinedWords.map((word, index) => (
              <DraggableOption
                key={index}
                word={word}
                index={index}
                moveOption={moveOption}
                deleteOption={deleteOption}
              />
            ))
          ) : (
            <p>No options yet. Underline text to create options.</p>
          )}
        </div>
      </DndProvider>

      <button
        onClick={() =>
          handleSave(questionIndex, {
            questionText,
            underlinedWords,
            answerText,
          })
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

export default ClozeQuestion;
