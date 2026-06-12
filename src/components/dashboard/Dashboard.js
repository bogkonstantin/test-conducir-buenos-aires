import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import Status from "./Status";
import Settings from "./Settings";
import ThemeToggle from "../ThemeToggle";
import { getCategoryFromStorage } from "../../lib/category";
import { mistakeCount } from "../../lib/mistakes";

const Dashboard = () => {
    const category = (getCategoryFromStorage() || "A").toLowerCase();
    const [mistakes, setMistakes] = useState(0);

    useEffect(() => {
        setMistakes(mistakeCount(category));
    }, [category]);

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-end">
                <ThemeToggle />
            </div>

            <Status />

            <div className="flex flex-col w-full max-w-xs gap-3 mt-6">
                <Link
                    to={`/category-${category}`}
                    className="text-center bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded">
                    Practice
                </Link>
                <Link
                    to={`/exam-${category}`}
                    className="text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black font-bold py-3 px-4 rounded">
                    Mock exam
                </Link>
                {mistakes > 0 && (
                    <Link
                        to={`/review-${category}`}
                        className="text-center bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800 dark:text-amber-100 text-amber-900 font-bold py-3 px-4 rounded">
                        Review mistakes ({mistakes})
                    </Link>
                )}
            </div>

            <Settings />
        </div>
    );
};

export default Dashboard;
