import * as React from "react"
import QuestionText from "../QuestionText";
import Header from "../Header";
import Answers from "../Answers";
import ControlButtons from "../ControlButtons";
import { getLanguageFromStorage } from "../../lib/language";
import { normalizeLocale } from "../../lib/i18n";
import { update as updateMastery } from "../../lib/mastery";
import { pickWeak } from "../../lib/selection";

const Test = ({questions, postfix}) => {

    const shuffleArray = (array) => {
        return array
            .map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value)
    }

    const getInitialState = () => {
        return {
            index: 0,
            language: normalizeLocale(getLanguageFromStorage()),
            selectedAnswer: null,
            isAnswered: false,
            stat: {
                questions: {},
                total: questions.length,
            },
            mastery: {},
            queue: shuffleArray(Object.keys(questions)),
        };
    }

    let initialState = typeof window !== 'undefined' && localStorage.getItem(`state${postfix}`);
    if (!initialState) {
        initialState = getInitialState();
    } else {
        initialState = JSON.parse(initialState);
    }

    const [state, _setState] = React.useState(initialState);

    const updateState = (newState) => {
        const newStateMerged = {
            ...state,
            ...newState
        };

        typeof window !== 'undefined' && localStorage.setItem(`state${postfix}`, JSON.stringify(newStateMerged));
        _setState(newStateMerged);
    }

    if (!state.queue.length) {
        return (
            <>
                <div className="mb-5">Ты все выучил, поздравляю!</div>
                <button
                    onClick={() => updateState(getInitialState())}
                    className="bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded mb-5">
                    Сбросить
                </button>
            </>
        );
    }

    const question = questions[state.index];

    return (
        <>

            <Header number={Number(state.index) + 1}
                    language={state.language}
                    onUpdateLang={(value) => updateState({language: value})}
                    stat={{...state.stat, queued: state.queue.length}}
            />
            <QuestionText question={question}
                          language={state.language}/>

            <Answers responses={question.responses}
                     language={state.language}
                     isAnswered={state.isAnswered}
                     selected={state.selectedAnswer}
                     onSelect={(i) => !state.isAnswered && updateState({selectedAnswer: i})}/>

            <ControlButtons isAnswered={state.isAnswered}
                            selected={state.selectedAnswer}
                            onAnswer={() => {
                                let stat = {...state.stat};
                                let queue = [...state.queue];
                                const correct = question.responses[state.selectedAnswer].correct;

                                if (!stat.questions[state.index]) {
                                    stat.questions[state.index] = 0;
                                }

                                if (correct) {
                                    stat.questions[state.index]++;
                                } else {
                                    stat.questions[state.index] = 0;
                                }

                                if (stat.questions[state.index] > 3) {
                                    delete stat.questions[state.index];
                                    queue.splice(queue.indexOf(String(state.index)), 1);
                                }

                                const mastery = {...(state.mastery || {})};
                                mastery[state.index] = updateMastery(mastery[state.index], question, correct, Date.now());

                                updateState({
                                    isAnswered: true,
                                    stat: stat,
                                    queue: queue,
                                    mastery: mastery,
                                });
                            }}

                            onNext={() => {
                                const index = pickWeak(state.queue, questions, state.mastery, Date.now());
                                updateState({
                                    index: index,
                                    selectedAnswer: null,
                                    isAnswered: false,
                                });
                            }}/>
        </>
    )
}

export default Test
