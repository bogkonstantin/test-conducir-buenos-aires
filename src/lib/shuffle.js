// Unbiased Fisher-Yates shuffle, shared by practice (queue order) and exam
// (question draw). Returns a new array; does not mutate the input.
function shuffle(array, rng = Math.random) {
    const out = array.slice();
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = out[i];
        out[i] = out[j];
        out[j] = tmp;
    }
    return out;
}

module.exports = { shuffle };
