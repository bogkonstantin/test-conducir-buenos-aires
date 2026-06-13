import React from 'react';
import { getLanguages } from "../../lib/language";
import { getCategories } from "../../lib/category";
import { t } from "../../lib/ui";

// Category and language selection are both owned by Dashboard (they drive
// Status, the mode links, and the t()-localized chrome) so changing either
// re-renders the whole dashboard.
function Settings({ category, onCategoryChange, language, onLanguageChange }) {
    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20 }}>
            <h2 className=''>{t('settings')}</h2>
            <div>
                <label className="block mb-1 font-medium" htmlFor="language-select">
                    {t('language')}
                    <select
                        id="language-select"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        style={{ marginLeft: 8 }}
                        className="dark:bg-gray-800 dark:text-gray-100 rounded"
                    >
                        <option value="" disabled>
                            {t('selectLanguage')}
                        </option>
                        {getLanguages().map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.label}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className="block mb-1 font-medium">
                    {t('testCategory')}
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                    >
                        {
                            getCategories().map(cat => (
                                <option key={cat.code} value={cat.code}>{cat.label[language] || cat.label.en}</option>
                            ))
                        }
                    </select>
                </label>
            </div>
        </div>
    );
}

export default Settings;
