const test = require('node:test');
const assert = require('node:assert');

// Minimal localStorage stub (these libs read the `localStorage` global at call time).
function installLocalStorage() {
    const m = new Map();
    global.localStorage = {
        getItem: (k) => (m.has(k) ? m.get(k) : null),
        setItem: (k, v) => { m.set(k, String(v)); },
        removeItem: (k) => { m.delete(k); },
        clear: () => m.clear(),
    };
    return m;
}

const { recordMistake, getMistakes, mistakeCount } = require('./mistakes');
const { recordAccuracy, accuracyStats, recordStudyDay, getStreak } = require('./stats');

test('mistakes: wrong adds, correct removes, no duplicates', () => {
    installLocalStorage();
    recordMistake('A', 5, false);
    recordMistake('A', 5, false); // no duplicate
    recordMistake('A', 7, false);
    assert.deepStrictEqual(getMistakes('A').sort(), ['5', '7']);
    assert.strictEqual(mistakeCount('A'), 2);

    recordMistake('A', 5, true); // clear it
    assert.deepStrictEqual(getMistakes('A'), ['7']);

    recordMistake('A', 99, true); // correct on a non-mistake is a no-op
    assert.deepStrictEqual(getMistakes('A'), ['7']);
});

test('mistakes are per-category', () => {
    installLocalStorage();
    recordMistake('A', 1, false);
    recordMistake('B', 2, false);
    assert.deepStrictEqual(getMistakes('A'), ['1']);
    assert.deepStrictEqual(getMistakes('B'), ['2']);
});

test('accuracy: totals, overall and recent window', () => {
    installLocalStorage();
    recordAccuracy('A', true);
    recordAccuracy('A', false);
    recordAccuracy('A', true);
    const s = accuracyStats('A');
    assert.strictEqual(s.total, 3);
    assert.strictEqual(s.correct, 2);
    assert.ok(Math.abs(s.overall - 2 / 3) < 1e-9);
    assert.ok(Math.abs(s.recent - 2 / 3) < 1e-9);
});

test('accuracy recent window is capped at 20', () => {
    installLocalStorage();
    for (let i = 0; i < 25; i++) recordAccuracy('A', true);
    recordAccuracy('A', false); // 26th, last in window
    const s = accuracyStats('A');
    assert.strictEqual(s.total, 26);
    assert.ok(Math.abs(s.recent - 19 / 20) < 1e-9); // 19 of last 20 correct
});

test('streak: first study day is 1 and idempotent same day', () => {
    installLocalStorage();
    assert.strictEqual(recordStudyDay(), 1);
    assert.strictEqual(recordStudyDay(), 1); // same day, no double count
    assert.strictEqual(getStreak().count, 1);
});
