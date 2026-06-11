import React, { useState } from 'react';
import { getLanguageFromStorage, saveLanguageToStorage, getLanguages } from "../../lib/language";
import { getCategoryFromStorage, saveCategoryToStorage, getCategories } from "../../lib/category";

function Settings() {
    const [language, setLanguage] = useState(getLanguageFromStorage() || 'en');
    const [category, setCategory] = React.useState(getCategoryFromStorage() || "A");

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        saveLanguageToStorage(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        saveCategoryToStorage(e.target.value);
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20 }}>
            <h2 className=''>{language === 'ru' ? 'Параметры' : 'Setting'}</h2>
            <div>
                <label className="block mb-1 font-medium" htmlFor="language-select">
                    {language === 'ru' ? 'Язык:' : 'Language:'}
                    <select
                        id="language-select"
                        value={language}
                        onChange={handleLanguageChange}
                        style={{ marginLeft: 8 }}
                    >
                        <option value="" disabled>
                            {language === 'ru' ? 'Выберите язык' : 'Select language'}
                        </option>
                        {getLanguages().map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.label}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label className="block mb-1 font-medium">
                    {language === 'ru' ? 'Категория теста:' : 'Test Category:'}
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="border rounded px-2 py-1"
                    >
                        {
                            getCategories().map(cat => (
                                <option key={cat.code} value={cat.code}>{cat.label[language]}</option>
                            ))
                        }
                    </select>
                </label>
            </div>
        </div>
    );
}

export default Settings;