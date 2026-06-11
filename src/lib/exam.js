// Real CABA (Buenos Aires) first driver's-license theory exam parameters.
// Applies to both categories A and B. Used by exam mode and the readiness estimate.
const EXAM = {
    questions: 40,     // questions drawn per exam
    passCorrect: 34,   // correct answers required to pass (85%)
    maxWrong: 6,       // i.e. you may miss at most 6
    timeLimitMin: 45,  // total time limit, minutes
};

module.exports = { EXAM };
