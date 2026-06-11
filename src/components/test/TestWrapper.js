import * as React from "react"
import Test from "./Test";
import Container from "../Container";
import { getQuestions } from "../../lib/questions";

let categoryHead = '';

const TestWrapper = ({ category }) => {
    categoryHead = category;
    const questions = getQuestions(category);
    return <>
        <Container>
            <div>
                <h1>Test Conducir Buenos Aires, Category {category.toUpperCase()}</h1>
            </div>
            <br />
            <Test questions={questions} postfix={`_cat_${category.toLowerCase()}`}></Test>
        </Container>
    </>;
}

export default TestWrapper

export const Head = () => <title>Test Conducir Buenos Aires, Category {categoryHead}</title>
