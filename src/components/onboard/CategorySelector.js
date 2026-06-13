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
            <h1 className="text-3xl font-bold tracking-tight mb-6 md:mb-8 text-center text-gray-900 dark:text-white">{t("chooseCategory")}</h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full items-stretch">
                {
                    getCategories().map(cat => (
                        <button
                            key={cat.code}
                            type="button"
                            onClick={() => handleSelection(cat.code)}
                            className="group flex-1 surface-inset p-6 md:p-8 text-center transition-all duration-200
                                       hover:-translate-y-1 hover:ring-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10
                                       focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                        >
                            <span className="font-display text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">{cat.label[language]}</span>
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default CategorySelector;