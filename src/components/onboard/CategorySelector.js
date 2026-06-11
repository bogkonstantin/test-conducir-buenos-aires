import React from "react";
import { getCategories, saveCategoryToStorage } from "../../lib/category";
import { getLanguageFromStorage } from "../../lib/language";

const CategorySelector = ({ onSelect }) => {
    const language = getLanguageFromStorage() || 'en';

    const handleSelection = (category) => {
        saveCategoryToStorage(category);
        if (onSelect) {
            onSelect(category);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Test Category</h1>
            <div className="flex flex-col md:flex-row gap-8">
                {
                    getCategories().map(cat => (
                        <button
                            key={cat.code}
                            type="button"
                            onClick={() => handleSelection(cat.code)}
                            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center hover:bg-blue-100 dark:hover:bg-gray-700 transition w-64"
                        >
                            <span className="text-xl font-semibold">{cat.label[language]}</span>
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default CategorySelector;