import React from "react";
import Status from "./Status";
import Settings from "./Settings";
import { getCategoryFromStorage } from "../../lib/category";

const Dashboard = () => {
    const category = getCategoryFromStorage().toLowerCase();

    return (
        <>
            <nav>
                <a href={`/category-${category}`}>Start {category.toUpperCase()}</a>
            </nav>

            <Status />
            <Settings />
        </>
    );
};

export default Dashboard;