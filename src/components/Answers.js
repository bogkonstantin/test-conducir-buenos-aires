import * as React from "react";
import {translate} from "../lib/i18n";

const Answers = ({responses, language, isAnswered, selected, onSelect}) => {
    return (
        <ul className="mt-6">
            {responses.map(
                (answer, index) => {
                    let color = "text-gray-900 dark:text-gray-100";
                    if (isAnswered) {
                        if (answer.correct) {
                            color = "text-green-700 dark:text-green-400";
                        }
                    }
                    const tran = translate(answer, language);

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
                            {tran && <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">{tran}</p>}
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default Answers;
