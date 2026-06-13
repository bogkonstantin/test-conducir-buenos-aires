import React, { useState, useEffect } from 'react';
import { getLanguages, saveLanguageToStorage } from '../../lib/language';

function detectBrowserLanguage() {
    if (typeof navigator === 'undefined') return 'en';
    const lang = navigator.language || navigator.userLanguage || 'en';
    if (lang.startsWith('ru')) return 'ru';
    return 'en';
}

const LanguageSelector = ({ onSelect }) => {
    const [selected, setSelected] = useState('');

    // navigator is unavailable during SSR; detect after hydration to avoid a mismatch.
    const [browserLang, setBrowserLang] = useState('en');
    useEffect(() => {
        setBrowserLang(detectBrowserLanguage());
    }, []);

    const handleChange = (e) => {
        setSelected(e.target.value);
        saveLanguageToStorage(e.target.value);
        if (onSelect) onSelect(e.target.value);
    };

    return (
        <div className="flex flex-col items-center text-center py-4">
            <label htmlFor="language-select" className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
                {browserLang === 'ru' ? 'Пожалуйста, выберите язык' : 'Please select your language'}
            </label>
            <select
                id="language-select"
                value={selected}
                onChange={handleChange}
                className="select-field text-base w-full max-w-xs py-2.5"
            >
                <option value="" disabled>
                    {browserLang === 'ru' ? 'Выберите язык' : 'Select language'}
                </option>
                {getLanguages().map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;