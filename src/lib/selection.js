// Question selection for practice mode: favour the questions you're weakest on.
//
// Each candidate id is weighted by (1 - currentP), so unseen and recently-missed
// questions come up more often, while near-mastered ones still surface sometimes
// (a weight floor keeps everything in rotation). Weighted-random rather than
// strict "weakest first" so practice doesn't get stuck on a single hard question.

const { currentP } = require('./mastery');

const WEIGHT_FLOOR = 0.05;

function pickWeak(ids, questions, masteryMap = {}, now = Date.now(), rng = Math.random) {
    if (!ids || ids.length === 0) return null;
    if (ids.length === 1) return ids[0];

    const weights = ids.map((id) => {
        const p = currentP(masteryMap[id], questions[id], now);
        return Math.max(WEIGHT_FLOOR, 1 - p);
    });
    const total = weights.reduce((a, b) => a + b, 0);

    let r = rng() * total;
    for (let i = 0; i < ids.length; i++) {
        r -= weights[i];
        if (r <= 0) return ids[i];
    }
    return ids[ids.length - 1];
}

module.exports = { pickWeak, WEIGHT_FLOOR };
