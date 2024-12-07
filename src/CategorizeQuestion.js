import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./CategorizeQuestion.css";

const CategorizeQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
}) => {
  const [categories, setCategories] = useState(questionData.categories || []);
  const [answers, setAnswers] = useState(questionData.answers || []);
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory(""); // Reset input after adding
    }
  };

  // Add new item with category
  const handleAddItem = () => {
    if (newItem.trim() && selectedCategory) {
      setAnswers([
        ...answers,
        {
          id: answers.length + 1,
          answer: newItem.trim(),
          category: selectedCategory,
        },
      ]);
      setNewItem(""); // Reset item input
      setSelectedCategory(""); // Reset category selection
    }
  };

  // Handle deleting category
  const handleDeleteCategory = (categoryName) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryName
    );
    setCategories(updatedCategories);
    const updatedItems = answers.filter(
      (item) => item.category !== categoryName
    );
    setAnswers(updatedItems); // Also remove answers belonging to deleted category
  };

  // Handle deleting item
  const handleDeleteItem = (itemId) => {
    const updatedItems = answers.filter((item) => item.id !== itemId);
    setAnswers(updatedItems);
  };

  // Handle editing item
  const handleEditItem = (itemId, newName) => {
    const updatedItems = answers.map((item) =>
      item.id === itemId ? { ...item, answer: newName } : item
    );
    setAnswers(updatedItems);
  };

  // Handle changing category for item
  const handleCategoryChangeForItem = (itemId, newCategory) => {
    const updatedItems = answers.map((item) =>
      item.id === itemId ? { ...item, category: newCategory } : item
    );
    setAnswers(updatedItems);
  };

  return (
    <div className="categorize">
      <DndProvider backend={HTML5Backend}>
        <div className="categorize-question">
          <div className="question">
            <h3>Question</h3>
          </div>

          {/* Categories Section */}
          <div className="categories-section">
            <h4>Categories</h4>
            {categories.map((category, index) => (
              <div key={index} className="category">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => {
                    const updatedCategories = [...categories];
                    updatedCategories[index] = e.target.value;
                    setCategories(updatedCategories);
                  }}
                />
                <button
                  className="delete-category"
                  onClick={() => handleDeleteCategory(category)}
                >
                  x
                </button>
              </div>
            ))}
          </div>

          {/* Add Category */}
          <div className="add-category">
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory}>+</button>
          </div>

          {/* Items Section */}
          <h4>Items</h4>
          <div className="answers-section">
            {answers.length === 0 ? (
              <p>Please add answers.</p>
            ) : (
              answers.map((item, index) => (
                <div key={item.id} className="item">
                  <input
                    type="text"
                    value={item.answer} // Use `item.answer` instead of `item.name`
                    onChange={(e) => handleEditItem(item.id, e.target.value)}
                  />
                  <select
                    value={item.category}
                    onChange={(e) =>
                      handleCategoryChangeForItem(item.id, e.target.value)
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    className="delete-item"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    x
                  </button>
                </div>
              ))
              
            )}
          </div>

          {/* Add Item */}
          <div className="add-item">
            <input
              type="text"
              placeholder="New Item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button onClick={handleAddItem} disabled={!selectedCategory}>
              +
            </button>
          </div>
        </div>
      </DndProvider>
      <button
        onClick={() =>
          handleSave(questionIndex, { categories, answers }, "categorize")
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

export default CategorizeQuestion;
