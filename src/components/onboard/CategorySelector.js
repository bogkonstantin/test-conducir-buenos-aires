import React from "react";
import { getCategories, saveCategoryToStorage } from "../../lib/category";
import { getLanguageFromStorage } from "../../lib/language";
import { t } from "../../lib/ui";

const CategorySelector = ({ onSelect }) => {
    const language = getLanguageFromStorage() || 'en';

    const handleSelection = (category) => {
        saveCategoryToStorage(category);
        if (onSelect) {
            onSelect(category);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 md:mb-8 text-center">{t("chooseCategory")}</h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-xs md:max-w-none items-center">
                {
                    getCategories().map(cat => (
                        <button
                            key={cat.code}
                            type="button"
                            onClick={() => handleSelection(cat.code)}
                            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8 text-center hover:bg-blue-100 dark:hover:bg-gray-700 transition w-full md:w-64"
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