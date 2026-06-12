import * as React from "react"
import { translate } from "../lib/i18n";

const QuestionText = ({question, language}) => {
    const tran = translate(question, language);

    return (
        <>
            <p className="text-xl mb-2">{question.text}</p>
            {tran && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tran}</p>}
            {
                question.img ?
                    <img className="mt-6 rounded-sm max-w-full h-auto" src={question.img} alt={question.text}/>
                    : null
            }
        </>
    )
}

export default QuestionText
