import { update as updateMastery } from "./mastery";
import { catSuffix } from "./keys";
import { shuffle } from "./shuffle";
import { getLanguageFromStorage } from "./language";
import { normalizeLocale } from "./i18n";

function getKey(postfix) {
    return `state${postfix}`;
}

// The per-category storage suffix. Category B progress lives at `state_cat_b`, etc.
function postfixFor(category) {
    return catSuffix(category);
}

// Parsed progress object for a category, or null if absent/unreadable.
function getProgress(category) {
    const raw = getProgressFromStorage(postfixFor(category));
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

// Update a question's mastery inside the stored practice state — but only when a
// full practice state already exists. Modes other than practice (review, exam)
// use this so they can improve readiness without risking a partial/broken state.
function recordMasteryIfPracticed(category, question, id, correct, now = Date.now()) {
    const state = getProgress(category);
    if (!state || !Array.isArray(state.queue)) return;
    state.mastery = state.mastery || {};
    state.mastery[id] = updateMastery(state.mastery[id], question, correct, now);
    saveProgressToStorage(postfixFor(category), JSON.stringify(state));
}

// A fresh practice state, matching Test.js's getInitialState — the only store
// for mastery is the practice state, so seeding one lets other modes contribute.
function initialState(questions) {
    return {
        index: 0,
        language: normalizeLocale(getLanguageFromStorage()),
        selectedAnswer: null,
        isAnswered: false,
        stat: { questions: {}, total: questions.length },
        mastery: {},
        queue: shuffle(Object.keys(questions)),
    };
}

// Like recordMasteryIfPracticed, but seeds a full practice state when none
// exists yet. Used by the mock exam so its answers always feed readiness
// (seen/mastered), not only for users who already opened practice. `questions`
// is the full category array (needed to build the initial queue).
function recordMastery(category, questions, question, id, correct, now = Date.now()) {
    let state = getProgress(category);
    if (!state || !Array.isArray(state.queue)) {
        state = initialState(questions);
    }
    state.mastery = state.mastery || {};
    state.mastery[id] = updateMastery(state.mastery[id], question, correct, now);
    saveProgressToStorage(postfixFor(category), JSON.stringify(state));
}

function getProgressFromStorage(postfix) {
    const key = getKey(postfix);

    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.error('Failed to get progress from storage', e);
        return null;
    }
}

function saveProgressToStorage(postfix, progress) {
    if (!postfix) throw new Error('Postfix is required');
    const key = getKey(postfix);

    try {
        localStorage.setItem(key, progress);
    } catch (e) {
        console.error('Failed to save progress to storage', e);
    }
}

export { getProgressFromStorage, saveProgressToStorage, postfixFor, getProgress, recordMasteryIfPracticed, recordMastery };