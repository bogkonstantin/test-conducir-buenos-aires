const test = require('node:test');
const assert = require('node:assert');

const { drawExamQuestions } = require('./exam');
const { pickWeak } = require('./selection');

test('drawExamQuestions returns n distinct in-range indices', () => {
    const draw = drawExamQuestions(500, 40);
    assert.strictEqual(draw.length, 40);
    assert.strictEqual(new Set(draw).size, 40); // distinct
    assert.ok(draw.every((i) => i >= 0 && i < 500));
});

test('drawExamQuestions caps at pool size', () => {
    const draw = drawExamQuestions(10, 40);
    assert.strictEqual(draw.length, 10);
    assert.strictEqual(new Set(draw).size, 10);
});

test('pickWeak favours the weaker question', () => {
    const questions = [{ responses: [{}, {}, {}] }, { responses: [{}, {}, {}] }];
    const now = Date.now();
    // id 0 mastered, id 1 unseen → id 1 should be picked far more often.
    const mastery = { 0: { m: 0.98, t: now } };
    let weak = 0;
    for (let i = 0; i < 1000; i++) {
        if (pickWeak(['0', '1'], questions, mastery, now) === '1') weak++;
    }
    assert.ok(weak > 800, `weak picked ${weak}/1000`);
});

test('pickWeak handles trivial inputs', () => {
    assert.strictEqual(pickWeak([], [], {}), null);
    assert.strictEqual(pickWeak(['3'], [{ responses: [{}, {}] }], {}), '3');
});
