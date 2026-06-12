import * as React from "react"
import { Link } from "gatsby"
import Test from "./Test";
import Container from "../Container";
import { getQuestions } from "../../lib/questions";
import { postfixFor } from "../../lib/progress";
import ThemeToggle from "../ThemeToggle";

let categoryHead = '';

const TestWrapper = ({ category }) => {
    categoryHead = category;
    const questions = getQuestions(category);
    return <>
        <Container>
            <div className="flex flex-row items-center justify-between gap-2 mb-6">
                <h1 className="text-xl font-bold">Practice · Category {category.toUpperCase()}</h1>
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">← Home</Link>
                </div>
            </div>
            <Test questions={questions} postfix={postfixFor(category)} category={category}></Test>
        </Container>
    </>;
}

export default TestWrapper

export const Head = () => <title>Practice · Category {categoryHead}</title>
