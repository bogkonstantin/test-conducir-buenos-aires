// Exam-readiness estimate.
//
// A real exam draws EXAM.questions at random from the pool and passes you at
// EXAM.passCorrect correct. With the pool (~500) far larger than the draw (40),
// drawing-with-replacement is a good approximation, under which the score is
// Binomial(EXAM.questions, meanP) where meanP is your average per-question
// success probability across the whole pool. Readiness = P(score >= passCorrect).
//
// Unseen questions sit at their guess rate, so readiness naturally stays low
// until the whole pool has been practiced — coverage is rewarded.

const { currentP } = require('./mastery');
const { EXAM } = require('./exam');

const MASTERED_THRESHOLD = 0.85;

// P(X >= k) for X ~ Binomial(n, p), computed by summing the lower tail iteratively.
function binomialTailAtLeast(k, n, p) {
    if (k <= 0) return 1;
    if (k > n) return 0;
    if (p <= 0) return 0;
    if (p >= 1) return 1;

    let cdfBelow = 0;          // P(X < k)
    let term = Math.pow(1 - p, n); // P(X = 0)
    for (let i = 0; i < k; i++) {
        if (i > 0) term = term * (p / (1 - p)) * (n - i + 1) / i;
        cdfBelow += term;
    }
    return Math.min(1, Math.max(0, 1 - cdfBelow));
}

// questions: array of question objects (for guess rates).
// masteryMap: { [questionIndex]: { m, t } }.
// Returns { probability, meanP, coverage, mastered, total }.
function readiness(questions, masteryMap = {}, now = Date.now(), exam = EXAM) {
    const total = questions ? questions.length : 0;
    if (!total) return { probability: 0, meanP: 0, coverage: 0, mastered: 0, total: 0 };

    let sum = 0;
    let seen = 0;
    let mastered = 0;
    for (let i = 0; i < total; i++) {
        const record = masteryMap[i];
        const p = currentP(record, questions[i], now);
        sum += p;
        if (record) seen += 1;
        if (p >= MASTERED_THRESHOLD) mastered += 1;
    }

    const meanP = sum / total;
    const probability = binomialTailAtLeast(exam.passCorrect, exam.questions, meanP);
    return { probability, meanP, coverage: seen / total, mastered, total };
}

module.exports = { readiness, binomialTailAtLeast, MASTERED_THRESHOLD };
