import * as React from "react";
import { t } from "../lib/ui";

const ControlButtons = ({isAnswered, selected, onAnswer, onNext}) => {
    const Container = ({children}) => {
        return (
            <div className="flex flex-row justify-center mt-10">
                {children}
            </div>
        );
    }

    if (isAnswered) {
        return (
            <Container>
                <button
                    onClick={() => onNext()}
                    className="bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
                    {t('next')}
                </button>
            </Container>
        );
    }

    let colors = 'bg-green-700 hover:bg-green-800 text-white';
    let text = t('check');
    if (selected === null) {
        colors = 'bg-gray-300 hover:bg-gray-400 text-black';
        text = t('chooseAnswer');
    }

    return (
        <Container>
            <button
                onClick={() => onAnswer()}
                disabled={selected === null}
                className={`${colors} font-bold py-2 px-4 rounded`}>
                {text}
            </button>
        </Container>
    );
}

export default ControlButtons;
