// Auto-collected mistakes per category, for a focused "review my mistakes" deck.
// A wrong answer adds the question id; a later correct answer removes it — so the
// set is always "questions you've missed and not yet gotten right since".
// Stored under its own key (mistakes_cat_x), separate from practice state, so any
// mode can update it without risk to the practice progress object.

const { mistakesKey: key } = require('./keys');

function getMistakes(category) {
    try {
        const raw = localStorage.getItem(key(category));
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function saveMistakes(category, ids) {
    try {
        localStorage.setItem(key(category), JSON.stringify(ids));
    } catch (e) {
        // ignore
    }
}

// Record an answer outcome: wrong adds the id, correct removes it.
function recordMistake(category, id, correct) {
    const sid = String(id);
    const ids = getMistakes(category);
    const has = ids.includes(sid);
    if (!correct && !has) {
        saveMistakes(category, ids.concat(sid));
    } else if (correct && has) {
        saveMistakes(category, ids.filter((x) => x !== sid));
    }
}

function mistakeCount(category) {
    return getMistakes(category).length;
}

module.exports = { getMistakes, recordMistake, mistakeCount, saveMistakes };
