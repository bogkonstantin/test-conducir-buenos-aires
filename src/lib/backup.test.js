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

const { exportProgress, importProgress } = require('./backup');

const progressState = JSON.stringify({ queue: ['0', '1'], stat: { questions: {}, total: 2 } });

test('backup: export/import round-trips everything the app persists', () => {
    const store = installLocalStorage();
    localStorage.setItem('state_cat_a', progressState);
    localStorage.setItem('mistakes_cat_a', JSON.stringify(['3']));
    localStorage.setItem('acc_cat_a', JSON.stringify({ total: 5, correct: 4, recent: [1, 1, 0, 1, 1] }));
    localStorage.setItem('selectedLanguage', 'ru');
    localStorage.setItem('selectedCategory', 'A');
    localStorage.setItem('onboardState', 'onboarding_completed');
    localStorage.setItem('studyStreak', JSON.stringify({ last: '2026-06-12', count: 3 }));
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('schemaVersion', '2');

    const dump = exportProgress();
    const before = new Map(store);

    store.clear();
    const { imported, skipped } = importProgress(dump);

    assert.deepStrictEqual(skipped, []);
    assert.strictEqual(imported.length, before.size);
    for (const [k, v] of before) {
        assert.strictEqual(localStorage.getItem(k), v, `round-trip of ${k}`);
    }
});

test('backup: malformed values are skipped, valid ones still import', () => {
    installLocalStorage();
    const dump = JSON.stringify({
        app: 'test-conducir-buenos-aires',
        data: {
            state_cat_a: progressState,
            state_cat_b: '"just a string"', // parses, but wrong shape
            mistakes_cat_a: '{"not":"an array"}',
            acc_cat_a: '{not json',
            selectedLanguage: 'fr', // unsupported
            theme: 'dark',
        },
    });

    const { imported, skipped } = importProgress(dump);

    assert.deepStrictEqual(imported.sort(), ['state_cat_a', 'theme']);
    assert.deepStrictEqual(
        skipped.sort(),
        ['acc_cat_a', 'mistakes_cat_a', 'selectedLanguage', 'state_cat_b'],
    );
    assert.strictEqual(localStorage.getItem('state_cat_b'), null);
    assert.strictEqual(localStorage.getItem('state_cat_a'), progressState);
});

test('backup: unknown keys in the file are ignored entirely', () => {
    installLocalStorage();
    const dump = JSON.stringify({
        data: { evilKey: 'x', state_cat_a: progressState },
    });
    importProgress(dump);
    assert.strictEqual(localStorage.getItem('evilKey'), null);
});

test('backup: rejects files with no usable data', () => {
    installLocalStorage();
    assert.throws(() => importProgress('{"data":{}}'), /no usable data/);
    assert.throws(() => importProgress('{"nope":1}'), /Unrecognised/);
    assert.throws(() => importProgress('not json'));
});

test('backup: importing a pre-migration file clears the schema marker', () => {
    installLocalStorage();
    localStorage.setItem('schemaVersion', '2');
    const legacyDump = JSON.stringify({ data: { state: progressState } });

    importProgress(legacyDump);

    // so runMigrations() re-evaluates the imported legacy data on next load
    assert.strictEqual(localStorage.getItem('schemaVersion'), null);
    assert.strictEqual(localStorage.getItem('state'), progressState);
});
