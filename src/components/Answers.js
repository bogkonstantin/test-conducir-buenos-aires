import * as React from "react";
import {translate} from "../lib/i18n";

const Answers = ({responses, language, isAnswered, selected, onSelect}) => {
    return (
        <ul className="mt-6 space-y-3">
            {responses.map(
                (answer, index) => {
                    const isSelected = index === selected;
                    const showCorrect = isAnswered && answer.correct;
                    const showWrong = isAnswered && isSelected && !answer.correct;

                    let rowState = "";
                    if (showCorrect) rowState = "answer-row-correct";
                    else if (showWrong) rowState = "answer-row-wrong";
                    else if (isSelected) rowState = "answer-row-selected";

                    let textColor = "text-gray-900 dark:text-slate-100";
                    if (showCorrect) textColor = "text-brand-700 dark:text-brand-300";
                    else if (showWrong) textColor = "text-red-600 dark:text-red-300";

                    // Indicator (custom radio) styling per state.
                    let dot = "border-gray-300 dark:border-slate-600";
                    if (showCorrect) dot = "border-brand-500 bg-brand-500 text-white";
                    else if (showWrong) dot = "border-red-500 bg-red-500 text-white";
                    else if (isSelected) dot = "border-brand-500 bg-brand-500 text-white";

                    const tran = translate(answer, language);

                    return (
                        <li key={index}>
                            <label htmlFor={`default-radio-${index}`}
                                   className={`answer-row ${rowState} ${isAnswered ? "cursor-default" : ""}`}>
                                <input id={`default-radio-${index}`}
                                       type="radio"
                                       checked={isSelected}
                                       name="default-radio"
                                       disabled={isAnswered}
                                       onChange={() => onSelect(index)}
                                       className="sr-only"/>
                                <span aria-hidden="true"
                                      className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${dot}`}>
                                    {showCorrect && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    )}
                                    {showWrong && (
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    )}
                                    {!isAnswered && isSelected && (
                                        <span className="h-2 w-2 rounded-full bg-white"/>
                                    )}
                                </span>
                                <span className="flex-1 min-w-0">
                                    <span className={`text-sm font-medium ${textColor}`}>{answer.text}</span>
                                    {tran && <span className="block text-sm text-gray-500 dark:text-slate-400 mt-0.5">{tran}</span>}
                                </span>
                            </label>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default Answers;
