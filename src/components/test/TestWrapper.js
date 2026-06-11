import * as React from "react"
import { Link } from "gatsby"
import Test from "./Test";
import Container from "../Container";
import { getQuestions } from "../../lib/questions";
import { postfixFor } from "../../lib/progress";

let categoryHead = '';

const TestWrapper = ({ category }) => {
    categoryHead = category;
    const questions = getQuestions(category);
    return <>
        <Container>
            <div className="flex flex-row items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Practice · Category {category.toUpperCase()}</h1>
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">← Home</Link>
            </div>
            <Test questions={questions} postfix={postfixFor(category)}></Test>
        </Container>
    </>;
}

export default TestWrapper

export const Head = () => <title>Practice · Category {categoryHead}</title>
