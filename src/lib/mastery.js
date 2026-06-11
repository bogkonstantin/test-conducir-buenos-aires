// Per-question mastery model.
//
// A mastery record is { m, t }: an estimate `m` in [0,1] of the probability you
// would answer the question correctly, captured at time `t` (ms epoch). Between
// updates the estimate decays toward the question's guess rate, modelling
// forgetting — a question nailed weeks ago is no longer a sure thing.
//
// Pure functions, no DOM/storage, so they can be unit-tested directly.

const DAY_MS = 24 * 60 * 60 * 1000;
// Memory half-life: after this long with no practice, mastery decays halfway
// back toward the guess rate.
const HALF_LIFE_MS = 14 * DAY_MS;
const DECAY_TAU = HALF_LIFE_MS / Math.LN2;
// How strongly a single answer moves the estimate toward the observed outcome.
const LEARNING_RATE = 0.5;

// Probability of guessing the question correctly with no knowledge (1 / #options).
function guessRate(question) {
    const n = (question && question.responses && question.responses.length) || 3;
    return 1 / n;
}

// Current probability of a correct answer, decayed from the stored record to `now`.
// No record => the question is unseen, so it sits at the guess rate.
function currentP(record, question, now) {
    const g = guessRate(question);
    if (!record) return g;
    const dt = Math.max(0, now - record.t);
    return g + (record.m - g) * Math.exp(-dt / DECAY_TAU);
}

// Returns the updated record after observing an answer (`correct` boolean).
function update(record, question, correct, now) {
    const p = currentP(record, question, now);
    const target = correct ? 1 : 0;
    const m = p + LEARNING_RATE * (target - p);
    return { m, t: now };
}

module.exports = {
    guessRate,
    currentP,
    update,
    HALF_LIFE_MS,
    LEARNING_RATE,
};
