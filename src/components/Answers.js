import * as React from "react";
import {getTranslation} from "../questions/questions";

const Answers = ({responses, language, isAnswered, selected, onSelect}) => {
    return (
        <ul className="mt-6">
            {responses.map(
                (answer, index) => {
                    let color = "text-gray-900";
                    if (isAnswered) {
                        if (answer.correct) {
                            color = "text-green-700";
                        }
                    }
                    const isLanguageSelected = language !== "0";

                    return (
                        <li className="mb-4" key={index}>
                            <div className="flex items-center">
                                <input id={`default-radio-${index}`}
                                       type="radio"
                                       value=""
                                       checked={index === selected}
                                       name="default-radio"
                                       onChange={() => onSelect(index)}
                                       className="w-4 h-4 focus:ring-0"/>
                                <label htmlFor={`default-radio-${index}`}
                                       className={`ml-3 ms-2 text-sm font-medium ${color}`}>{answer.text}</label>
                            </div>
                            {
                                isLanguageSelected ?
                                    <p className="text-sm mb-6 text-gray-600">
                                        {getTranslation(answer.text)}
                                    </p>
                                    : (isLanguageSelected && <p className="text-sm mb-6 text-red-600">нет перевода</p>)
                            }
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default Answers;
