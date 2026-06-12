// Question data, loaded on demand. Each category JSON is ~600KB, so they are
// dynamic import()s — webpack splits them into separate async chunks and a page
// only downloads the category it actually shows (and never during SSR).
//
// Data invariant: questions are append-only. Each question's `id` equals its
// array position, and all stored progress (queue, mastery, mistakes) is keyed
// by it — reordering or deleting entries would corrupt every user's progress.
const cache = {};

async function loadQuestions(category) {
    const cat = String(category).toUpperCase();
    if (cache[cat]) return cache[cat];

    let mod;
    if (cat === 'A') {
        mod = await import('../../static/api/questions/category-a.json');
    } else if (cat === 'B') {
        mod = await import('../../static/api/questions/category-b.json');
    } else {
        throw new Error('Unknown category: ' + category);
    }
    cache[cat] = mod.default || mod;
    return cache[cat];
}

export { loadQuestions };
