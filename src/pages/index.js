import * as React from "react"
import {getQuestions} from "../questions/questions";
import Container from "../components/Container";
import QuestionText from "../components/QuestionText";
import Header from "../components/Header";
import Answers from "../components/Answers";
import ControlButtons from "../components/ControlButtons";

const IndexPage = () => {
    const questions = getQuestions();

    const shuffleArray = (array) => {
        return array
            .map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value)
    }

    const getInitialState = () => {
        return {
            index: 0,
            language: "0",
            selectedAnswer: null,
            isAnswered: false,
            stat: {
                questions: {},
                total: questions.length,
            },
            queue: shuffleArray(Object.keys(questions)),
        };
    }

    let initialState = localStorage.getItem('state');
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

        localStorage.setItem('state', JSON.stringify(newStateMerged));
        _setState(newStateMerged);
    }

    if (!state.queue.length) {
        return (
            <Container>
                <div className="mb-5">Ты все выучил, поздравляю!</div>
                <button
                    onClick={() => updateState(getInitialState())}
                    className="bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded mb-5">
                    Сбросить
                </button>
            </Container>
        );
    }

    const question = questions[state.index];

    return (
        <>
            <Container>
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
                                    if (!stat.questions[state.index]) {
                                        stat.questions[state.index] = 0;
                                    }

                                    if (question.responses[state.selectedAnswer].correct) {
                                        stat.questions[state.index]++;
                                    } else {
                                        stat.questions[state.index] = 0;
                                    }

                                    if (stat.questions[state.index] > 3) {
                                        delete stat.questions[state.index];
                                        queue.splice(queue.indexOf(String(state.index)), 1);
                                    }

                                    updateState({
                                        isAnswered: true,
                                        stat: stat,
                                        queue: queue,
                                    });
                                }}

                                onNext={() => {
                                    const index = state.queue.length ? state.queue[Math.floor(Math.random() * state.queue.length)] : null;
                                    updateState({
                                        index: index,
                                        selectedAnswer: null,
                                        isAnswered: false,
                                    });
                                }}/>

            </Container>
        </>
    )
}

export default IndexPage

export const Head = () => <title>Test Conducir Buenos Aires</title>
