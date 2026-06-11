// UI chrome strings. These follow the chosen app locale (en/ru) — distinct from
// the per-question content locale (es/en/ru) handled by i18n.js. Spanish is a
// content language only, so UI chrome falls back to English.
import { getLanguageFromStorage } from "./language";

const STRINGS = {
    en: {
        question: "Question",
        check: "Check answer",
        chooseAnswer: "Choose an answer",
        next: "Next question",
        allLearned: "You've learned everything. Congrats!",
        reset: "Reset",
        questionsLabel: "questions",
        masteredLabel: "mastered",
        masteredNote: "questions answered correctly several times in a row",
    },
    ru: {
        question: "Вопрос",
        check: "Проверить ответ",
        chooseAnswer: "Выберите ответ",
        next: "Следующий вопрос",
        allLearned: "Ты всё выучил, поздравляю!",
        reset: "Сбросить",
        questionsLabel: "вопросов",
        masteredLabel: "выучено",
        masteredNote: "вопросы, на которые вы несколько раз подряд ответили правильно",
    },
};

function getUiLocale() {
    return getLanguageFromStorage() === "ru" ? "ru" : "en";
}

function t(key) {
    const l = getUiLocale();
    return (STRINGS[l] && STRINGS[l][key]) || STRINGS.en[key] || key;
}

export { t, getUiLocale };
