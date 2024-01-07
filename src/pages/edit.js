import * as React from "react"
import {getQuestions} from "../questions/questions";

const EditPage = () => {
    const questions = getQuestions();

    const trans = {};
    for (let i = 0; i < questions.length; i++) {
        trans[questions[i].text] = questions[i].text;
        for (let k = 0; k < questions[i].responses.length; k++) {
            trans[questions[i].responses[k].text] = questions[i].responses[k].text;
        }
    }

    return (
        <>
            {
                Object.keys(trans).map((tran, i) => {
                    return (
                        <>
                            <code>{tran}</code>--|||--{tran}
                            <hr/>
                        </>
                    )
                })
            }
        </>
    )
}

export default EditPage
