import * as React from "react"
import {getQuestions} from "../questions/category-b";
import Test from "../components/Test";

const IndexPage = () => {
    const questions = getQuestions();
    return <Test questions={questions} postfix=""></Test>;
}

export default IndexPage

export const Head = () => <title>Test Conducir Buenos Aires, Category B</title>
