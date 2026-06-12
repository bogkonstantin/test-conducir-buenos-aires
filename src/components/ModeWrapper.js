import * as React from "react";
import { Link } from "gatsby";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import Test from "./test/Test";
import Exam from "./exam/Exam";
import Review from "./review/Review";
import { loadQuestions } from "../lib/questions";
import { postfixFor } from "../lib/progress";
import { EXAM } from "../lib/exam";
import { t } from "../lib/ui";

// One wrapper for all three study modes. Owns the shared page chrome (heading,
// theme toggle, home link) and the async question loading, so the six category
// pages stay one-liners.
// `title` is the static English label used for the SSR <title> tag (localStorage
// is unavailable at build time); `titleKey`/`subtitle` drive the visible, localized
// chrome via t().
const MODES = {
    practice: {
        title: "Practice",
        titleKey: "practice",
        render: (questions, category) => (
            <Test questions={questions} postfix={postfixFor(category)} category={category} />
        ),
    },
    exam: {
        title: "Mock exam",
        titleKey: "mockExam",
        subtitle: () => `${EXAM.questions} ${t("questionsLabel")} · ${EXAM.timeLimitMin} ${t("min")} · ${t("passAt")} ${EXAM.passCorrect}`,
        render: (questions, category) => <Exam questions={questions} category={category} />,
    },
    review: {
        title: "Review",
        titleKey: "review",
        render: (questions, category) => <Review questions={questions} category={category} />,
    },
};

const ModeWrapper = ({ mode, category }) => {
    const { titleKey, subtitle, render } = MODES[mode];
    const [questions, setQuestions] = React.useState(null);

    React.useEffect(() => {
        let active = true;
        loadQuestions(category).then((qs) => {
            if (active) setQuestions(qs);
        });
        return () => {
            active = false;
        };
    }, [category]);

    return (
        <Container>
            <div className="flex flex-row items-start justify-between gap-2 mb-6">
                <div>
                    <h1 className="text-xl font-bold">{t(titleKey)} · {t("category")} {category.toUpperCase()}</h1>
                    {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle()}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <ThemeToggle />
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">← {t("home")}</Link>
                </div>
            </div>
            {questions
                ? render(questions, category)
                : <p className="text-sm text-gray-500 dark:text-gray-400">{t("loading")}</p>}
        </Container>
    );
};

export default ModeWrapper;

// Static per-page <title> factory — avoids feeding Gatsby's Head API from
// state mutated during render.
export const makeHead = (mode, category) => {
    const PageHead = () => <title>{MODES[mode].title} · Category {category}</title>;
    return PageHead;
};
