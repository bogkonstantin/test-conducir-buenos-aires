import React, { useState, useRef } from 'react';
import { getLanguageFromStorage, saveLanguageToStorage, getLanguages } from "../../lib/language";
import { getCategoryFromStorage, saveCategoryToStorage, getCategories } from "../../lib/category";
import { exportProgress, importProgress } from "../../lib/backup";

function Settings() {
    const [language, setLanguage] = useState(getLanguageFromStorage() || 'en');
    const [category, setCategory] = React.useState(getCategoryFromStorage() || "A");
    const fileInput = useRef(null);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        saveLanguageToStorage(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        saveCategoryToStorage(e.target.value);
    };

    const handleExport = () => {
        const blob = new Blob([exportProgress()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'driving-test-progress.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                importProgress(reader.result);
                window.location.reload();
            } catch (err) {
                window.alert((language === 'ru' ? 'Не удалось импортировать: ' : 'Could not import: ') + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
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
                        className="dark:bg-gray-800 dark:text-gray-100 rounded"
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
                        className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                    >
                        {
                            getCategories().map(cat => (
                                <option key={cat.code} value={cat.code}>{cat.label[language]}</option>
                            ))
                        }
                    </select>
                </label>
            </div>

            <div className="mt-6">
                <span className="block mb-1 font-medium">
                    {language === 'ru' ? 'Прогресс:' : 'Progress:'}
                </span>
                <div className="flex flex-row gap-2">
                    <button
                        type="button"
                        onClick={handleExport}
                        className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black py-1 px-3 rounded">
                        {language === 'ru' ? 'Экспорт' : 'Export'}
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInput.current && fileInput.current.click()}
                        className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black py-1 px-3 rounded">
                        {language === 'ru' ? 'Импорт' : 'Import'}
                    </button>
                    <input
                        ref={fileInput}
                        type="file"
                        accept="application/json,.json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Settings;