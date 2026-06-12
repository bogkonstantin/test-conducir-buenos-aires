import * as React from "react";
import { Link } from "gatsby";
import Review from "./Review";
import Container from "../Container";
import { getQuestions } from "../../lib/questions";
import ThemeToggle from "../ThemeToggle";

let categoryHead = "";

const ReviewWrapper = ({ category }) => {
    categoryHead = category;
    const questions = getQuestions(category);
    return (
        <Container>
            <div className="flex flex-row items-center justify-between mb-6 gap-2">
                <h1 className="text-xl font-bold">Review · Category {category.toUpperCase()}</h1>
                <div className="flex items-center gap-1 shrink-0">
                    <ThemeToggle />
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">← Home</Link>
                </div>
            </div>
            <Review questions={questions} category={category} />
        </Container>
    );
};

export default ReviewWrapper;

export const Head = () => <title>Review · Category {categoryHead}</title>;
