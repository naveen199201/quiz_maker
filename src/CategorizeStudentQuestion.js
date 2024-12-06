import React from "react";

const CategorizeStudentQuestion = ({ question, answer, onAnswerChange }) => {
  const handleItemDrop = (itemId, categoryId) => {
    onAnswerChange({
      ...answer,
      [itemId]: categoryId,
    });
  };

  return (
    <div className="categorize-question">
      <p>{question.data.title}</p>
      <div className="categories">
        {question.data.categories.map((category) => (
          <div key={category.id} className="category">
            <h4>{category.name}</h4>
            <div className="category-items">
              {Object.keys(answer).map(
                (itemId) =>
                  answer[itemId] === category.id && (
                    <div key={itemId} className="item">
                      {question.data.items.find((item) => item.id === itemId)
                        ?.name || ""}
                    </div>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="items">
        {question.data.items.map((item) => (
          <div
            key={item.id}
            className="item"
            onDragStart={() => handleItemDrop(item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorizeStudentQuestion;
