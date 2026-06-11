import * as React from "react";
import Exam from "./Exam";
import Container from "../Container";
import { getQuestions } from "../../lib/questions";
import { EXAM } from "../../lib/exam";
import ThemeToggle from "../ThemeToggle";

let categoryHead = "";

const ExamWrapper = ({ category }) => {
    categoryHead = category;
    const questions = getQuestions(category);
    return (
        <Container>
            <div className="flex flex-row items-start justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold">Mock exam · Category {category.toUpperCase()}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {EXAM.questions} questions · {EXAM.timeLimitMin} min · pass at {EXAM.passCorrect}
                    </p>
                </div>
                <ThemeToggle />
            </div>
            <Exam questions={questions} />
        </Container>
    );
};

export default ExamWrapper;

export const Head = () => <title>Mock Exam · Category {categoryHead}</title>;
