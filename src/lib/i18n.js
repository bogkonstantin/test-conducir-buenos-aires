// Single locale model for the test UI.
// 'es' = show original Spanish only (the language of the real exam); 'en'/'ru' add a translation.
const TEST_LOCALES = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
];

// Legacy in-test value "0" (and any unknown/empty value) meant "no translation" → Spanish only.
function normalizeLocale(value) {
    if (value === 'en' || value === 'ru') return value;
    return 'es';
}

// Returns the translation for a { tran: { en, ru } } item, or null when Spanish-only or missing.
function translate(item, locale) {
    const loc = normalizeLocale(locale);
    if (loc === 'es') return null;
    return (item && item.tran && item.tran[loc]) || null;
}

export { TEST_LOCALES, normalizeLocale, translate };
