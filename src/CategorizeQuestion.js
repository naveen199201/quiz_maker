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
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        { id: categories.length + 1, name: newCategory.trim() },
      ]);
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
          name: newItem.trim(),
          categoryId: selectedCategory,
        },
      ]);
      setNewItem(""); // Reset item input
      setSelectedCategory(""); // Reset category selection
    }
  };

  // Handle deleting category
  const handleDeleteCategory = (categoryId) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );
    setCategories(updatedCategories);
    const updatedItems = answers.filter(
      (item) => item.categoryId !== categoryId
    );
    setAnswers(updatedItems); // Also remove answers belonging to deleted category
  };

  // Handle deleting item
  const handleDeleteItem = (itemId) => {
    const updatedItems = answers.filter((item) => item.id !== itemId);
    setAnswers(updatedItems);
  };

  // Handle editing category
  const handleEditCategory = (categoryId, newName) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId ? { ...category, name: newName } : category
    );
    setCategories(updatedCategories);
  };

  // Handle editing item
  const handleEditItem = (itemId, newName) => {
    const updatedItems = answers.map((item) =>
      item.id === itemId ? { ...item, name: newName } : item
    );
    setAnswers(updatedItems);
  };

  // Handle changing category for item
  const handleCategoryChangeForItem = (itemId, newCategoryId) => {
    const updatedItems = answers.map((item) =>
      item.id === itemId ? { ...item, categoryId: newCategoryId } : item
    );
    setAnswers(updatedItems);
  };

  // Category Drag source
  const CategoryItem = ({ category, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "CATEGORY",
      item: { index, id: category.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="category"
      >
        <input
          type="text"
          value={category.name}
          onChange={(e) => handleEditCategory(category.id, e.target.value)}
        />
        <button
          className="delete-category"
          onClick={() => handleDeleteCategory(category.id)}
        >
          x
        </button>
      </div>
    );
  };

  // Category Drop Target
  const CategoryDropTarget = ({ children }) => {
    const [, drop] = useDrop({
      accept: "CATEGORY",
      hover: (item) => {
        moveCategory(item.index, item.id);
      },
    });

    return (
      <div ref={drop} className="categories-section">
        {children}
      </div>
    );
  };

  // Move Category Function
  const moveCategory = (fromIndex, toId) => {
    const updatedCategories = [...categories];
    const [removed] = updatedCategories.splice(fromIndex, 1);
    const toIndex = updatedCategories.findIndex(
      (category) => category.id === toId
    );
    updatedCategories.splice(toIndex, 0, removed);
    setCategories(updatedCategories);
  };

  // Item Drag source
  const Item = ({ item, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "ITEM",
      item: { index, id: item.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="item"
      >
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleEditItem(item.id, e.target.value)}
        />
        <select
          value={item.categoryId}
          onChange={(e) => handleCategoryChangeForItem(item.id, e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
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
    );
  };

  // Item Drop Target (Reordering answers)
  const ItemDropTarget = ({ children }) => {
    const [, drop] = useDrop({
      accept: "ITEM",
      hover: (item) => {
        moveItem(item.index, item.id);
      },
    });

    return (
      <div ref={drop} className="answers-section">
        {children}
      </div>
    );
  };

  // Move Item Function
  const moveItem = (fromIndex, toId) => {
    const updatedItems = [...answers];
    const [removed] = updatedItems.splice(fromIndex, 1);
    const toIndex = updatedItems.findIndex((item) => item.id === toId);
    updatedItems.splice(toIndex, 0, removed);
    setAnswers(updatedItems);
  };

  return (
    <div className="categorize">
      <DndProvider backend={HTML5Backend}>
        <div className="categorize-question">
          <h3>Item Creation with Category Dropdown</h3>

          {/* Categories Section */}
          <CategoryDropTarget>
            <h4>Categories</h4>
            {categories.map((category, index) => (
              <CategoryItem
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </CategoryDropTarget>

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
          <ItemDropTarget>
            {answers.length === 0 ? (
              <p>Please add answers.</p>
            ) : (
              answers.map((item, index) => (
                <Item key={item.id} item={item} index={index} />
              ))
            )}
          </ItemDropTarget>

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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
        onClick={() => handleSave(questionIndex, { categories, answers })}
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
