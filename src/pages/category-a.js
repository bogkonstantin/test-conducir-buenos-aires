import * as React from "react"
import {getQuestions} from "../questions/category-a";
import Test from "../components/Test";

const CategoryAPage = () => {
    const questions = getQuestions();
    return <Test questions={questions} postfix="_cat_a"></Test>;
}

export default CategoryAPage

export const Head = () => <title>Test Conducir Buenos Aires, Category A</title>
