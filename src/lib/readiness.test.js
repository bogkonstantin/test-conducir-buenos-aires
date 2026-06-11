const test = require('node:test');
const assert = require('node:assert');

const { currentP, update, guessRate, HALF_LIFE_MS } = require('./mastery');
const { readiness, binomialTailAtLeast } = require('./readiness');

const q3 = { responses: [{}, {}, {}] }; // 3-option question, guess rate 1/3
const q2 = { responses: [{}, {}] };     // 2-option question, guess rate 1/2

test('guessRate is 1 / number of options', () => {
    assert.ok(Math.abs(guessRate(q3) - 1 / 3) < 1e-9);
    assert.ok(Math.abs(guessRate(q2) - 1 / 2) < 1e-9);
    assert.strictEqual(guessRate(undefined), 1 / 3); // default
});

test('unseen question sits at the guess rate', () => {
    assert.ok(Math.abs(currentP(undefined, q3, Date.now()) - 1 / 3) < 1e-9);
});

test('a correct answer raises mastery, a wrong answer lowers it', () => {
    const now = Date.now();
    const afterCorrect = update(undefined, q3, true, now);
    const afterWrong = update(undefined, q3, false, now);
    assert.ok(afterCorrect.m > 1 / 3);
    assert.ok(afterWrong.m < 1 / 3);
});

test('repeated correct answers approach certainty', () => {
    let rec;
    let now = Date.now();
    for (let i = 0; i < 6; i++) rec = update(rec, q3, true, now);
    assert.ok(rec.m > 0.95);
});

test('mastery decays toward the guess rate over time', () => {
    const now = Date.now();
    const rec = { m: 0.95, t: now };
    const halfLater = currentP(rec, q3, now + HALF_LIFE_MS);
    // After one half-life it should be roughly halfway between 0.95 and 1/3.
    const midpoint = (0.95 + 1 / 3) / 2;
    assert.ok(Math.abs(halfLater - midpoint) < 0.02);
});

test('binomial tail: boundary behaviour', () => {
    assert.strictEqual(binomialTailAtLeast(0, 40, 0.5), 1);
    assert.strictEqual(binomialTailAtLeast(41, 40, 0.9), 0);
    assert.strictEqual(binomialTailAtLeast(34, 40, 1), 1);
    assert.strictEqual(binomialTailAtLeast(34, 40, 0), 0);
});

test('binomial tail: 34/40 sanity bounds and monotonicity', () => {
    const at80 = binomialTailAtLeast(34, 40, 0.80);
    const at90 = binomialTailAtLeast(34, 40, 0.90);
    assert.ok(at80 < 0.3, `P(>=34|0.80)=${at80}`);
    assert.ok(at90 > 0.8, `P(>=34|0.90)=${at90}`);
    assert.ok(at90 > at80); // monotonic in p
});

test('readiness: empty progress is low, full mastery is high', () => {
    const questions = Array.from({ length: 100 }, () => q3);
    const now = Date.now();

    const cold = readiness(questions, {}, now);
    assert.ok(cold.probability < 0.05);
    assert.strictEqual(cold.coverage, 0);

    const mastery = {};
    for (let i = 0; i < questions.length; i++) mastery[i] = { m: 0.97, t: now };
    const hot = readiness(questions, mastery, now);
    assert.ok(hot.probability > 0.9, `probability=${hot.probability}`);
    assert.strictEqual(hot.coverage, 1);
    assert.strictEqual(hot.mastered, 100);
});

test('readiness: empty pool is safe', () => {
    const r = readiness([], {}, Date.now());
    assert.strictEqual(r.probability, 0);
    assert.strictEqual(r.total, 0);
});
