import * as React from "react"
import {getQuestions} from "../questions/category-a";
import Test from "../components/Test";
import Container from "../components/Container";

const CategoryAPage = () => {
    const questions = getQuestions();
    return <>
        <Container>
            <div>
                <h1>Test Conducir Buenos Aires, Category A</h1>
                <a className="text-blue-600 underline dark:text-blue-500" href="/">Category B</a>
            </div>
            <br/>
            <Test questions={questions} postfix="_cat_a"></Test>
        </Container>
    </>;
}

export default CategoryAPage

export const Head = () => <title>Test Conducir Buenos Aires, Category A</title>
