import * as React from "react"
import { translate } from "../lib/i18n";

const QuestionText = ({question, language}) => {
    const tran = translate(question, language);

    return (
        <>
            <p className="font-display text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-gray-900 dark:text-white mb-1.5">{question.text}</p>
            {tran && <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{tran}</p>}
            {
                question.img ?
                    <img className="mt-5 rounded-2xl max-w-full h-auto ring-1 ring-gray-900/5 dark:ring-white/10" src={question.img} alt={question.text}/>
                    : null
            }
        </>
    )
}

export default QuestionText
