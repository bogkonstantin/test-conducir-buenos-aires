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

// runMigrations is a no-op during SSR; pretend we're a browser.
global.window = {};

const { runMigrations, masteryFromLegacy, SCHEMA_VERSION } = require('./migrate');

// A realistic pre-migration practice state as written by the old Test.js:
// queue of string indices, per-question consecutive-correct counters.
function legacyState() {
    return {
        index: 2,
        language: '0',
        selectedAnswer: null,
        isAnswered: false,
        stat: { questions: { 0: 2, 2: 0 }, total: 4 },
        queue: ['0', '2', '3'], // question 1 was memorized (spliced out)
    };
}

test('migrate: legacy orphan "state" key is recovered as category B', () => {
    installLocalStorage();
    localStorage.setItem('state', JSON.stringify(legacyState()));

    runMigrations();

    const migrated = JSON.parse(localStorage.getItem('state_cat_b'));
    assert.ok(migrated, 'state_cat_b should exist after migration');
    assert.deepStrictEqual(migrated.queue, ['0', '2', '3']);
    assert.strictEqual(localStorage.getItem('schemaVersion'), String(SCHEMA_VERSION));
});

test('migrate: orphan "state" never overwrites existing state_cat_b', () => {
    installLocalStorage();
    localStorage.setItem('state', JSON.stringify(legacyState()));
    const existing = { ...legacyState(), queue: ['1'] };
    localStorage.setItem('state_cat_b', JSON.stringify(existing));

    runMigrations();

    assert.deepStrictEqual(JSON.parse(localStorage.getItem('state_cat_b')).queue, ['1']);
});

test('migrate: mastery is backfilled from queue/streak data', () => {
    installLocalStorage();
    localStorage.setItem('state_cat_a', JSON.stringify(legacyState()));

    runMigrations();

    const { mastery } = JSON.parse(localStorage.getItem('state_cat_a'));
    assert.ok(mastery, 'mastery map should be created');
    // question 1: memorized (absent from queue) → seeded high
    assert.ok(Math.abs(mastery['1'].m - 0.95) < 1e-9);
    // question 0: streak of 2 → 0.45 + 0.13 * 2
    assert.ok(Math.abs(mastery['0'].m - 0.71) < 1e-9);
    // question 2: streak of 0 → base seed
    assert.ok(Math.abs(mastery['2'].m - 0.45) < 1e-9);
    // question 3: queued but never answered → unseen, no record
    assert.strictEqual(mastery['3'], undefined);
});

test('migrate: existing user progress is otherwise untouched', () => {
    installLocalStorage();
    const legacy = legacyState();
    localStorage.setItem('state_cat_a', JSON.stringify(legacy));

    runMigrations();

    const migrated = JSON.parse(localStorage.getItem('state_cat_a'));
    assert.deepStrictEqual(migrated.queue, legacy.queue);
    assert.deepStrictEqual(migrated.stat, legacy.stat);
    assert.strictEqual(migrated.index, legacy.index);
});

test('migrate: idempotent — second run changes nothing', () => {
    installLocalStorage();
    localStorage.setItem('state_cat_a', JSON.stringify(legacyState()));

    runMigrations();
    const first = localStorage.getItem('state_cat_a');
    runMigrations();
    assert.strictEqual(localStorage.getItem('state_cat_a'), first);
});

test('migrate: skips a schema-current store', () => {
    installLocalStorage();
    localStorage.setItem('schemaVersion', String(SCHEMA_VERSION));
    localStorage.setItem('state_cat_a', JSON.stringify(legacyState()));

    runMigrations();

    // No mastery backfill: migrations didn't run.
    assert.strictEqual(JSON.parse(localStorage.getItem('state_cat_a')).mastery, undefined);
});

test('migrate: corrupted progress JSON does not abort the migration', () => {
    installLocalStorage();
    localStorage.setItem('state_cat_a', '{not json');
    localStorage.setItem('state_cat_b', JSON.stringify(legacyState()));

    assert.doesNotThrow(() => runMigrations());

    // The healthy category still migrated and the version advanced.
    assert.ok(JSON.parse(localStorage.getItem('state_cat_b')).mastery);
    assert.strictEqual(localStorage.getItem('schemaVersion'), String(SCHEMA_VERSION));
});

test('masteryFromLegacy clamps streaks into the seed range', () => {
    const now = Date.now();
    const mastery = masteryFromLegacy(
        { stat: { total: 2, questions: { 0: 99 } }, queue: ['0', '1'] },
        now,
    );
    // streak clamped to 3 → max seed 0.45 + 0.39 = 0.84, below the 0.95 "memorized" seed
    assert.ok(Math.abs(mastery['0'].m - 0.84) < 1e-9);
    assert.strictEqual(mastery['0'].t, now);
});
