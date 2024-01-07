import * as React from "react"
import {getTranslation} from "../questions/questions";

const QuestionText = ({question, language}) => {
    const isLanguageSelected = language !== "0";

    return (
        <>
            <p className="text-xl mb-2">{question.text}</p>
            {
                isLanguageSelected ?
                    <p className="text-sm text-gray-600 mb-2">{getTranslation(question.text)}</p>
                    : isLanguageSelected && <p className="text-sm text-red-600 mb-2">нет перевода</p>
            }
            {
                question.img ?
                    <img className="mt-6 rounded-sm" src={question.img} alt={question.text}/>
                    : null
            }
        </>
    )
}

export default QuestionText
