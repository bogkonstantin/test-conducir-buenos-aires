import * as React from "react"
import {getQuestions} from "../questions/category-b";
import Test from "../components/Test";
import Container from "../components/Container";

const IndexPage = () => {
    const questions = getQuestions();
    return <>
        <Container>
            <div>
                <h1>Test Conducir Buenos Aires, Category B</h1>
                <a className="text-blue-600 underline dark:text-blue-500" href="/category-a">Category A</a>
            </div>
            <br/>
            <Test questions={questions} postfix=""></Test>
        </Container>
    </>;
}

export default IndexPage

export const Head = () => <title>Test Conducir Buenos Aires, Category B</title>
