import * as React from "react";
import { Link } from "gatsby";
import QuestionText from "../QuestionText";
import Answers from "../Answers";
import ControlButtons from "../ControlButtons";
import { getMistakes, recordMistake } from "../../lib/mistakes";
import { recordAccuracy, recordStudyDay } from "../../lib/stats";
import { recordMasteryIfPracticed } from "../../lib/progress";
import { getLanguageFromStorage } from "../../lib/language";
import { normalizeLocale } from "../../lib/i18n";
import { t } from "../../lib/ui";
import { track } from "../../lib/analytics";

const homeBtn =
    "inline-block bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black font-bold py-2 px-4 rounded";

// Drill only the questions you've previously missed, with immediate feedback.
// A correct answer clears the question from the mistakes set.
const Review = ({ questions, category }) => {
    const [ids, setIds] = React.useState(null); // snapshot taken on mount
    const [pos, setPos] = React.useState(0);
    const [selected, setSelected] = React.useState(null);
    const [answered, setAnswered] = React.useState(false);
    const [cleared, setCleared] = React.useState(0);
    const language = normalizeLocale(getLanguageFromStorage());

    React.useEffect(() => {
        const mistakes = getMistakes(category);
        setIds(mistakes);
        if (mistakes.length > 0) track('review_started', { category, count: mistakes.length });
    }, [category]);

    const handleSelect = (i) => {
        if (!answered) setSelected(i);
    };

    const handleAnswer = () => {
        if (answered || selected === null) return;
        const qid = ids[pos];
        const correct = questions[qid].responses[selected].correct;
        recordMistake(category, qid, correct);
        recordAccuracy(category, correct);
        recordMasteryIfPracticed(category, questions[qid], qid, correct);
        recordStudyDay();
        if (correct) setCleared((c) => c + 1);
        setAnswered(true);
    };

    const handleNext = () => {
        setPos((p) => p + 1);
        setSelected(null);
        setAnswered(false);
    };

    React.useEffect(() => {
        if (!ids || pos >= ids.length) return;
        const onKey = (e) => {
            const q = questions[ids[pos]];
            if (/^[1-9]$/.test(e.key)) {
                const i = Number(e.key) - 1;
                if (!answered && i < q.responses.length) handleSelect(i);
            } else if (e.key === "Enter") {
                if (answered) handleNext();
                else handleAnswer();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    if (!ids) {
        return <p className="text-sm text-gray-500 dark:text-gray-400">{t("loading")}</p>;
    }

    if (ids.length === 0) {
        return (
            <div>
                <p className="mb-5">{t("noMistakes")}</p>
                <Link to="/" className={homeBtn}>{t("home")}</Link>
            </div>
        );
    }

    if (pos >= ids.length) {
        return (
            <div>
                <p className="mb-2">{t("reviewComplete")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                    {t("cleared").replace("{n}", cleared).replace("{total}", ids.length)}
                </p>
                <Link to="/" className={homeBtn}>{t("home")}</Link>
            </div>
        );
    }

    const question = questions[ids[pos]];

    return (
        <>
            <div className="mb-6">
                <h3 className="text-sm">{t("question")} {pos + 1} / {ids.length}</h3>
            </div>
            <QuestionText question={question} language={language} />
            <Answers
                responses={question.responses}
                language={language}
                isAnswered={answered}
                selected={selected}
                onSelect={handleSelect}
            />
            <ControlButtons
                isAnswered={answered}
                selected={selected}
                onAnswer={handleAnswer}
                onNext={handleNext}
            />
        </>
    );
};

export default Review;
