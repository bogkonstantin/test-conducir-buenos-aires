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
                    className="btn-primary min-w-[10rem]">
                    {t('next')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
            </Container>
        );
    }

    return (
        <Container>
            <button
                onClick={() => onAnswer()}
                disabled={selected === null}
                className="btn-primary min-w-[10rem]">
                {selected === null ? t('chooseAnswer') : t('check')}
            </button>
        </Container>
    );
}

export default ControlButtons;
