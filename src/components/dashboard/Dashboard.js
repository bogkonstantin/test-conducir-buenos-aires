import React from "react";
import { Link } from "gatsby";
import Status from "./Status";
import Settings from "./Settings";
import ThemeToggle from "../ThemeToggle";
import { getCategoryFromStorage } from "../../lib/category";

const Dashboard = () => {
    const category = (getCategoryFromStorage() || "A").toLowerCase();

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-end">
                <ThemeToggle />
            </div>

            <Status />

            <div className="flex flex-col w-full gap-3 mt-6" style={{ maxWidth: 250 }}>
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
            </div>

            <Settings />
        </div>
    );
};

export default Dashboard;
