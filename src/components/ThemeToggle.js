import React, { useState, useEffect } from "react";
import { isDark, toggleTheme } from "../lib/theme";

const ThemeToggle = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setDark(isDark());
    }, []);

    const onClick = () => {
        setDark(toggleTheme() === "dark");
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            className="text-lg leading-none p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            {dark ? "☀️" : "🌙"}
        </button>
    );
};

export default ThemeToggle;
