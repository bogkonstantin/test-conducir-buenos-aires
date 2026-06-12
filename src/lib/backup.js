// Export/import of all progress. Everything lives in localStorage with no
// backend, so this is the only way to move progress between devices or keep a
// safety copy.
const KEYS = [
    'schemaVersion',
    'onboardState',
    'selectedLanguage',
    'selectedCategory',
    'state_cat_a',
    'state_cat_b',
    'state', // legacy Category-B key, kept so older backups round-trip
    'mistakes_cat_a',
    'mistakes_cat_b',
    'acc_cat_a',
    'acc_cat_b',
    'studyStreak',
    'theme',
];

function exportProgress() {
    const data = {};
    for (const key of KEYS) {
        try {
            const value = localStorage.getItem(key);
            if (value !== null) data[key] = value;
        } catch (e) {
            // ignore unreadable keys
        }
    }
    return JSON.stringify(
        { app: 'test-conducir-buenos-aires', exportedAt: new Date().toISOString(), data },
        null,
        2,
    );
}

function importProgress(json) {
    const parsed = JSON.parse(json);
    const data = parsed && parsed.data;
    if (!data || typeof data !== 'object') {
        throw new Error('Unrecognised backup file');
    }
    for (const key of KEYS) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            try {
                localStorage.setItem(key, data[key]);
            } catch (e) {
                // ignore unwritable keys
            }
        }
    }
}

export { exportProgress, importProgress, KEYS };
