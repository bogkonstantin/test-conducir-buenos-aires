// Single source of truth for every localStorage key the app persists.
// Key construction used to be scattered across progress.js, mistakes.js,
// stats.js and a hardcoded list in backup.js; build all keys here so adding a
// key (or renaming a suffix) can't silently fall out of backup/restore.

const CATEGORY_CODES = ['a', 'b'];

function catSuffix(category) {
    return `_cat_${String(category).toLowerCase()}`;
}

function progressKey(category) {
    return `state${catSuffix(category)}`;
}

function mistakesKey(category) {
    return `mistakes${catSuffix(category)}`;
}

function accuracyKey(category) {
    return `acc${catSuffix(category)}`;
}

// Keys that exist once, not per category.
const SINGLETON_KEYS = [
    'schemaVersion',
    'onboardState',
    'selectedLanguage',
    'selectedCategory',
    'studyStreak',
    'theme',
    'state', // legacy Category-B progress key, kept so older backups round-trip
];

// Every key the app persists — the backup/restore surface.
function allPersistedKeys() {
    const perCategory = CATEGORY_CODES.flatMap((c) => [
        progressKey(c),
        mistakesKey(c),
        accuracyKey(c),
    ]);
    return SINGLETON_KEYS.concat(perCategory);
}

module.exports = {
    CATEGORY_CODES,
    catSuffix,
    progressKey,
    mistakesKey,
    accuracyKey,
    allPersistedKeys,
};
