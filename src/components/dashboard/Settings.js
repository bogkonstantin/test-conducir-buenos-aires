import React, { useState, useRef } from 'react';
import { getLanguageFromStorage, saveLanguageToStorage, getLanguages } from "../../lib/language";
import { getCategories } from "../../lib/category";
import { exportProgress, importProgress } from "../../lib/backup";
import { track } from "../../lib/analytics";
import { t } from "../../lib/ui";

// Category selection is owned by Dashboard (it drives Status and the mode
// links); language is local because only this component and t() consume it.
function Settings({ category, onCategoryChange }) {
    const [language, setLanguage] = useState(getLanguageFromStorage() || 'en');
    const fileInput = useRef(null);

    const handleLanguageChange = (e) => {
        saveLanguageToStorage(e.target.value);
        setLanguage(e.target.value);
    };

    const handleExport = () => {
        const blob = new Blob([exportProgress()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'driving-test-progress.json';
        a.click();
        URL.revokeObjectURL(url);
        track('progress_exported');
    };

    const handleImport = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const { skipped } = importProgress(reader.result);
                track('progress_imported', { skipped: skipped.length });
                if (skipped.length > 0) {
                    window.alert(t('importSkipped') + skipped.join(', '));
                }
                window.location.reload();
            } catch (err) {
                window.alert(t('importFailed') + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20 }}>
            <h2 className=''>{t('settings')}</h2>
            <div>
                <label className="block mb-1 font-medium" htmlFor="language-select">
                    {t('language')}
                    <select
                        id="language-select"
                        value={language}
                        onChange={handleLanguageChange}
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

            <div className="mt-6">
                <span className="block mb-1 font-medium">
                    {t('progress')}
                </span>
                <div className="flex flex-row gap-2">
                    <button
                        type="button"
                        onClick={handleExport}
                        className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black py-1 px-3 rounded">
                        {t('export')}
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInput.current && fileInput.current.click()}
                        className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black py-1 px-3 rounded">
                        {t('import')}
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
