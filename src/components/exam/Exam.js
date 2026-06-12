import * as React from "react";
import { Link } from "gatsby";
import QuestionText from "../QuestionText";
import Answers from "../Answers";
import { EXAM, drawExamQuestions } from "../../lib/exam";
import { getLanguageFromStorage } from "../../lib/language";
import { translate } from "../../lib/i18n";
import { t } from "../../lib/ui";
import { recordMistake } from "../../lib/mistakes";
import { recordAccuracy, recordStudyDay } from "../../lib/stats";
import { recordMasteryIfPracticed } from "../../lib/progress";
import { track } from "../../lib/analytics";

function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function correctIndex(question) {
    return question.responses.findIndex((r) => r.correct);
}

// A timed simulation of the real exam: EXAM.questions drawn at random,
// EXAM.timeLimitMin to answer, Spanish only and no per-question feedback.
// Read-only with respect to mastery — practice mode is what teaches.
const Exam = ({ questions, category }) => {
    const [ids, setIds] = React.useState(null);
    const [startedAt, setStartedAt] = React.useState(null);
    const [answers, setAnswers] = React.useState({}); // examPosition -> responseIndex
    const [current, setCurrent] = React.useState(0);
    const [remaining, setRemaining] = React.useState(EXAM.timeLimitMin * 60);
    const [finished, setFinished] = React.useState(false);
    const [timedOut, setTimedOut] = React.useState(false);
    const finishedRef = React.useRef(false);

    const start = React.useCallback(() => {
        finishedRef.current = false;
        setIds(drawExamQuestions(questions.length, EXAM.questions));
        setAnswers({});
        setCurrent(0);
        setRemaining(EXAM.timeLimitMin * 60);
        setFinished(false);
        setTimedOut(false);
        setStartedAt(Date.now());
        track('exam_started', { category });
    }, [questions.length, category]);

    // Draw the exam once, on the client (avoids an SSR/hydration mismatch).
    React.useEffect(() => {
        start();
    }, [start]);

    const finish = React.useCallback((dueToTimeout = false) => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        if (dueToTimeout) setTimedOut(true);
        setFinished(true);
    }, []);

    // Countdown driven by wall-clock so it stays accurate across re-renders.
    React.useEffect(() => {
        if (!startedAt || finished) return;
        const tick = () => {
            const left = EXAM.timeLimitMin * 60 - Math.floor((Date.now() - startedAt) / 1000);
            if (left <= 0) {
                setRemaining(0);
                finish(true);
            } else {
                setRemaining(left);
            }
        };
        tick();
        const handle = setInterval(tick, 1000);
        return () => clearInterval(handle);
    }, [startedAt, finished, finish]);

    // Keyboard: 1..9 pick an answer, arrows navigate, Enter advances / finishes.
    React.useEffect(() => {
        if (!ids || finished) return;
        const onKey = (e) => {
            const q = questions[ids[current]];
            if (/^[1-9]$/.test(e.key)) {
                const i = Number(e.key) - 1;
                if (i < q.responses.length) setAnswers((a) => ({ ...a, [current]: i }));
            } else if (e.key === "ArrowLeft") {
                setCurrent((c) => Math.max(0, c - 1));
            } else if (e.key === "ArrowRight") {
                setCurrent((c) => Math.min(ids.length - 1, c + 1));
            } else if (e.key === "Enter") {
                if (current === ids.length - 1) finish(false);
                else setCurrent((c) => Math.min(ids.length - 1, c + 1));
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [ids, current, finished, finish, questions]);

    // On finish, record results to mistakes/accuracy/streak (and mastery if the
    // user has a practice session going). Runs once per completed exam.
    React.useEffect(() => {
        if (!finished || !ids || !category) return;
        let score = 0;
        ids.forEach((qid, pos) => {
            const sel = answers[pos];
            const answered = sel != null;
            const correct = answered && questions[qid].responses[sel].correct;
            if (correct) score++;
            recordMistake(category, qid, correct);
            if (answered) {
                recordAccuracy(category, correct);
                recordMasteryIfPracticed(category, questions[qid], qid, correct);
            }
        });
        recordStudyDay();
        track('exam_finished', {
            category,
            score,
            total: ids.length,
            passed: score >= EXAM.passCorrect,
            timed_out: timedOut,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finished]);

    if (!ids) {
        return <p className="text-sm text-gray-500">{t("preparingExam")}</p>;
    }

    const answeredCount = Object.keys(answers).length;

    if (finished) {
        const locale = getLanguageFromStorage();
        const wrong = ids
            .map((qid, pos) => ({ qid, pos }))
            .filter(({ qid, pos }) => answers[pos] !== correctIndex(questions[qid]));
        const score = ids.length - wrong.length;
        const passed = score >= EXAM.passCorrect;

        return (
            <div>
                <h1 className="text-2xl font-bold mb-2">{passed ? `✅ ${t("passed")}` : `❌ ${t("notPassed")}`}</h1>
                <p className="text-lg mb-1">
                    <strong>{score}</strong> / {EXAM.questions} {t("correctLabel")}
                    <span className="text-gray-500 text-sm"> ({t("need")} {EXAM.passCorrect})</span>
                </p>
                {timedOut && <p className="text-sm text-red-600 mb-1">{t("timeExpired")}</p>}
                <p className="text-sm text-gray-600 mb-6">
                    {passed
                        ? t("examPassMsg")
                        : t("examFailMsg").replace("{n}", EXAM.maxWrong)}
                </p>

                <div className="flex flex-row gap-3 mb-8">
                    <button
                        onClick={start}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                        {t("retakeExam")}
                    </button>
                    <Link
                        to="/"
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black font-bold py-2 px-4 rounded">
                        {t("home")}
                    </Link>
                </div>

                {wrong.length > 0 && (
                    <>
                        <h2 className="text-lg font-semibold mb-4">{t("review")} ({wrong.length})</h2>
                        <ul>
                            {wrong.map(({ qid, pos }) => {
                                const q = questions[qid];
                                const correct = q.responses[correctIndex(q)];
                                const chosen = answers[pos] != null ? q.responses[answers[pos]] : null;
                                const correctTran = translate(correct, locale);
                                return (
                                    <li key={pos} className="mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                                        <p className="text-base mb-2">{q.text}</p>
                                        {q.img && <img className="mb-2 rounded-sm max-w-full h-auto max-h-48" src={q.img} alt={q.text} />}
                                        <p className="text-sm text-green-700">✓ {correct.text}</p>
                                        {correctTran && <p className="text-xs text-gray-500 mb-1">{correctTran}</p>}
                                        <p className="text-sm text-red-600">
                                            ✗ {chosen ? chosen.text : t("noAnswer")}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        );
    }

    const qid = ids[current];
    const question = questions[qid];
    const isLast = current === ids.length - 1;

    return (
        <div>
            <div className="flex flex-row items-center justify-between mb-6">
                <span className="text-sm text-gray-500">
                    {t("question")} {current + 1} / {ids.length}
                </span>
                <span className={`text-sm font-mono ${remaining <= 60 ? "text-red-600" : "text-gray-700 dark:text-gray-300"}`}>
                    ⏱ {formatTime(remaining)}
                </span>
            </div>

            <QuestionText question={question} language="es" />

            <Answers
                responses={question.responses}
                language="es"
                isAnswered={false}
                selected={answers[current] ?? null}
                onSelect={(i) => setAnswers((a) => ({ ...a, [current]: i }))}
            />

            <div className="flex flex-row justify-between items-center gap-2 flex-wrap mt-10">
                <button
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                    className={`font-bold py-2 px-4 rounded ${current === 0 ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600" : "bg-gray-100 hover:bg-gray-200 text-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"}`}>
                    {t("back")}
                </button>

                <span className="text-xs text-gray-400">{answeredCount} {t("answered")}</span>

                {isLast ? (
                    <button
                        onClick={() => finish(false)}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                        {t("finish")}
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrent((c) => Math.min(ids.length - 1, c + 1))}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black font-bold py-2 px-4 rounded">
                        {t("nextShort")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Exam;
