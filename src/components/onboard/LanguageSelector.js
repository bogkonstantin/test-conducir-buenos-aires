import React, { useState, useEffect } from 'react';
import { getLanguages, saveLanguageToStorage } from '../../lib/language';

function detectBrowserLanguage() {
    if (typeof navigator === 'undefined') return 'en';
    const lang = navigator.language || navigator.userLanguage || 'en';
    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('es')) return 'es';
    return 'en';
}

// Onboarding prompt is shown before a language is chosen, so it follows the
// detected browser language rather than the stored app locale.
const PROMPTS = {
    en: { title: 'Please select your language', placeholder: 'Select language' },
    ru: { title: 'Пожалуйста, выберите язык', placeholder: 'Выберите язык' },
    es: { title: 'Por favor, elegí tu idioma', placeholder: 'Elegí un idioma' },
};

const LanguageSelector = ({ onSelect }) => {
    const [selected, setSelected] = useState('');

    // navigator is unavailable during SSR; detect after hydration to avoid a mismatch.
    const [browserLang, setBrowserLang] = useState('en');
    useEffect(() => {
        setBrowserLang(detectBrowserLanguage());
    }, []);

    const prompt = PROMPTS[browserLang] || PROMPTS.en;

    const handleChange = (e) => {
        setSelected(e.target.value);
        saveLanguageToStorage(e.target.value);
        if (onSelect) onSelect(e.target.value);
    };

    return (
        <div className="flex flex-col items-center text-center py-4">
            <label htmlFor="language-select" className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
                {prompt.title}
            </label>
            <select
                id="language-select"
                value={selected}
                onChange={handleChange}
                className="select-field text-base w-full max-w-xs py-2.5"
            >
                <option value="" disabled>
                    {prompt.placeholder}
                </option>
                {getLanguages().map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;