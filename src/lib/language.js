const key = 'selectedLanguage';
let cachedLanguage = null;

function getLanguages() {
    return [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'English' },
        { code: 'ru', label: 'Русский' }
    ];
}

function getLanguageFromStorage() {
    if (cachedLanguage !== null) {
        return cachedLanguage;
    }
    if (typeof window === 'undefined') return null;
    try {
        cachedLanguage = localStorage.getItem(key);
        return cachedLanguage;
    } catch (e) {
        console.error('Failed to get language from storage', e);
        return null;
    }
}

function saveLanguageToStorage(lang) {
    if (!lang) throw new Error('Language code is required');
    if (cachedLanguage === lang) return;
    if (!getLanguages().some(l => l.code === lang)) {
        throw new Error(`Unsupported language code: ${lang}`);
    }

    try {
        localStorage.setItem(key, lang);
        cachedLanguage = lang;
    } catch (e) {
        console.error('Failed to save language to storage', e);
    }
}

export { getLanguages, getLanguageFromStorage, saveLanguageToStorage };