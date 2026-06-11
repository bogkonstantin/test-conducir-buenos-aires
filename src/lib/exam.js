// Real CABA (Buenos Aires) first driver's-license theory exam parameters.
// Applies to both categories A and B. Used by exam mode and the readiness estimate.
const EXAM = {
    questions: 40,     // questions drawn per exam
    passCorrect: 34,   // correct answers required to pass (85%)
    maxWrong: 6,       // i.e. you may miss at most 6
    timeLimitMin: 45,  // total time limit, minutes
};

// Draw `n` distinct question indices at random from a pool of `total` questions.
// Returns fewer than n only if the pool is smaller than n.
function drawExamQuestions(total, n = EXAM.questions) {
    const indices = Array.from({ length: total }, (_, i) => i);
    // Partial Fisher-Yates: shuffle just the first `count` slots.
    const count = Math.min(n, total);
    for (let i = 0; i < count; i++) {
        const j = i + Math.floor(Math.random() * (total - i));
        const tmp = indices[i];
        indices[i] = indices[j];
        indices[j] = tmp;
    }
    return indices.slice(0, count);
}

module.exports = { EXAM, drawExamQuestions };
