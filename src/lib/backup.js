// Export/import of all progress. Everything lives in localStorage with no
// backend, so this is the only way to move progress between devices or keep a
// safety copy. The key list is derived from keys.js so new persisted keys are
// picked up automatically.
const {
    allPersistedKeys,
    progressKey,
    mistakesKey,
    accuracyKey,
    CATEGORY_CODES,
} = require('./keys');

function isPlainObject(x) {
    return !!x && typeof x === 'object' && !Array.isArray(x);
}

// Stored values are strings; JSON-typed keys must parse into the shape their
// reader expects. `pred` receives the parsed value.
function jsonOf(pred) {
    return (value) => {
        try {
            return pred(JSON.parse(value));
        } catch (e) {
            return false;
        }
    };
}

const isProgressState = jsonOf((s) => isPlainObject(s) && Array.isArray(s.queue) && isPlainObject(s.stat));
const isMistakeList = jsonOf(Array.isArray);
const isAccuracy = jsonOf((a) => isPlainObject(a) && typeof a.total === 'number');

// One validator per persisted key. Imports only write keys whose value the
// app's readers can actually consume; anything else is skipped and reported.
function validators() {
    const v = {
        schemaVersion: (x) => /^\d+$/.test(x),
        onboardState: (x) =>
            ['language_selection', 'category_selection', 'onboarding_completed'].includes(x),
        selectedLanguage: (x) => ['en', 'ru'].includes(x),
        selectedCategory: (x) => ['A', 'B'].includes(x),
        studyStreak: jsonOf((s) => isPlainObject(s) && typeof s.count === 'number'),
        theme: (x) => ['light', 'dark'].includes(x),
        state: isProgressState, // legacy Category-B key
    };
    for (const c of CATEGORY_CODES) {
        v[progressKey(c)] = isProgressState;
        v[mistakesKey(c)] = isMistakeList;
        v[accuracyKey(c)] = isAccuracy;
    }
    return v;
}

function exportProgress() {
    const data = {};
    for (const key of allPersistedKeys()) {
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

// Writes only known keys whose values pass shape validation.
// Returns { imported, skipped } so the UI can tell the user about bad keys.
function importProgress(json) {
    const parsed = JSON.parse(json);
    const data = parsed && parsed.data;
    if (!data || typeof data !== 'object') {
        throw new Error('Unrecognised backup file');
    }
    const check = validators();
    const imported = [];
    const skipped = [];
    for (const key of allPersistedKeys()) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
        const value = data[key];
        if (typeof value !== 'string' || !check[key](value)) {
            skipped.push(key);
            continue;
        }
        try {
            localStorage.setItem(key, value);
            imported.push(key);
        } catch (e) {
            skipped.push(key);
        }
    }
    if (imported.length === 0) {
        throw new Error('Backup contained no usable data');
    }
    // A backup without a schemaVersion predates migrations; drop the local
    // marker so runMigrations() re-evaluates the imported data on next load
    // (migrations are idempotent, so this is safe even when nothing is legacy).
    if (!Object.prototype.hasOwnProperty.call(data, 'schemaVersion')) {
        try {
            localStorage.removeItem('schemaVersion');
        } catch (e) {
            // ignore
        }
    }
    return { imported, skipped };
}

module.exports = { exportProgress, importProgress };
