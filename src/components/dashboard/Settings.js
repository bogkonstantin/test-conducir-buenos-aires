import React from 'react';
import { getLanguages } from "../../lib/language";
import { getCategories } from "../../lib/category";
import { t } from "../../lib/ui";

// Category and language selection are both owned by Dashboard (they drive
// Status, the mode links, and the t()-localized chrome) so changing either
// re-renders the whole dashboard.
function Settings({ category, onCategoryChange, language, onLanguageChange }) {
    return (
        <div className="w-full max-w-xs mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-3">
                {t('settings')}
            </h2>
            <div className="flex items-center justify-between gap-3 py-1.5">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300" htmlFor="language-select">
                    {t('language')}
                </label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="select-field"
                >
                    <option value="" disabled>
                        {t('selectLanguage')}
                    </option>
                    {getLanguages().map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center justify-between gap-3 py-1.5">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300" htmlFor="category-select">
                    {t('testCategory')}
                </label>
                <select
                    id="category-select"
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="select-field"
                >
                    {
                        getCategories().map(cat => (
                            <option key={cat.code} value={cat.code}>{cat.label[language] || cat.label.en}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
}

export default Settings;
