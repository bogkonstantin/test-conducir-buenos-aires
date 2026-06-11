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
        <div>
            <label htmlFor="language-select">
                {browserLang === 'ru' ? 'Пожалуйста, выберите язык:' : 'Please select your language:'}
            </label>
            <select
                id="language-select"
                value={selected}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
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