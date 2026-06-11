import * as React from "react";
import { Link } from "gatsby";
import QuestionText from "../QuestionText";
import Answers from "../Answers";
import { EXAM, drawExamQuestions } from "../../lib/exam";
import { getLanguageFromStorage } from "../../lib/language";
import { translate } from "../../lib/i18n";

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
const Exam = ({ questions }) => {
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
    }, [questions.length]);

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

    if (!ids) {
        return <p className="text-sm text-gray-500">Preparing exam…</p>;
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
                <h1 className="text-2xl font-bold mb-2">{passed ? "✅ Passed" : "❌ Not passed"}</h1>
                <p className="text-lg mb-1">
                    <strong>{score}</strong> / {EXAM.questions} correct
                    <span className="text-gray-500 text-sm"> (need {EXAM.passCorrect})</span>
                </p>
                {timedOut && <p className="text-sm text-red-600 mb-1">Time expired before you finished.</p>}
                <p className="text-sm text-gray-600 mb-6">
                    {passed
                        ? "You'd likely pass the real exam. Keep practicing to stay sharp."
                        : `You may miss at most ${EXAM.maxWrong}. Review the misses below and keep practicing.`}
                </p>

                <div className="flex flex-row gap-3 mb-8">
                    <button
                        onClick={start}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                        Retake exam
                    </button>
                    <Link
                        to="/"
                        className="bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
                        Home
                    </Link>
                </div>

                {wrong.length > 0 && (
                    <>
                        <h2 className="text-lg font-semibold mb-4">Review ({wrong.length})</h2>
                        <ul>
                            {wrong.map(({ qid, pos }) => {
                                const q = questions[qid];
                                const correct = q.responses[correctIndex(q)];
                                const chosen = answers[pos] != null ? q.responses[answers[pos]] : null;
                                const correctTran = translate(correct, locale);
                                return (
                                    <li key={pos} className="mb-6 border-b border-gray-100 pb-4">
                                        <p className="text-base mb-2">{q.text}</p>
                                        {q.img && <img className="mb-2 rounded-sm max-h-48" src={q.img} alt={q.text} />}
                                        <p className="text-sm text-green-700">✓ {correct.text}</p>
                                        {correctTran && <p className="text-xs text-gray-500 mb-1">{correctTran}</p>}
                                        <p className="text-sm text-red-600">
                                            ✗ {chosen ? chosen.text : "(no answer)"}
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
                    Question {current + 1} / {ids.length}
                </span>
                <span className={`text-sm font-mono ${remaining <= 60 ? "text-red-600" : "text-gray-700"}`}>
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

            <div className="flex flex-row justify-between items-center mt-10">
                <button
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                    className={`font-bold py-2 px-4 rounded ${current === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-black"}`}>
                    Back
                </button>

                <span className="text-xs text-gray-400">{answeredCount} answered</span>

                {isLast ? (
                    <button
                        onClick={() => finish(false)}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                        Finish
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrent((c) => Math.min(ids.length - 1, c + 1))}
                        className="bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Exam;
