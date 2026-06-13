// Single source of truth for the per-category localStorage key suffixes.
// Key construction used to be scattered across progress.js, mistakes.js and
// stats.js; build the suffixed keys here so renaming a suffix stays in one place.

function catSuffix(category) {
    return `_cat_${String(category).toLowerCase()}`;
}

function mistakesKey(category) {
    return `mistakes${catSuffix(category)}`;
}

function accuracyKey(category) {
    return `acc${catSuffix(category)}`;
}

// In-progress mock-exam session, so an accidental reload can offer to resume.
function examSessionKey(category) {
    return `examSession${catSuffix(category)}`;
}

module.exports = {
    catSuffix,
    mistakesKey,
    accuracyKey,
    examSessionKey,
};
