import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import Status from "./Status";
import Settings from "./Settings";
import ThemeToggle from "../ThemeToggle";
import { getCategoryFromStorage, saveCategoryToStorage } from "../../lib/category";
import { getLanguageFromStorage, saveLanguageToStorage } from "../../lib/language";
import { mistakeCount } from "../../lib/mistakes";
import { track } from "../../lib/analytics";
import { t } from "../../lib/ui";

const REPO_URL = "https://github.com/bogkonstantin/test-conducir-buenos-aires";
const SITE_URL = "https://driver.bogomolov.tech";
const { version } = require("../../../package.json");

const Dashboard = () => {
    const [category, setCategory] = useState(getCategoryFromStorage() || "A");
    const [language, setLanguage] = useState(getLanguageFromStorage() || "en");
    const [mistakes, setMistakes] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleCategoryChange = (cat) => {
        saveCategoryToStorage(cat);
        setCategory(cat);
    };

    // Owned here (not in Settings) so the whole dashboard re-renders on change —
    // the mode-link labels below read the locale via t().
    const handleLanguageChange = (lang) => {
        saveLanguageToStorage(lang);
        setLanguage(lang);
    };

    // Native share sheet on mobile; copy-to-clipboard fallback on desktop.
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Test de Conducir · Buenos Aires",
                    text: t('shareText'),
                    url: SITE_URL,
                });
                track('app_shared', { method: 'web_share' });
            } catch (e) {
                // user dismissed the share sheet — not an error
            }
        } else {
            try {
                await navigator.clipboard.writeText(SITE_URL);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                track('app_shared', { method: 'clipboard' });
            } catch (e) {
                window.prompt('Copy link:', SITE_URL);
            }
        }
    };

    useEffect(() => {
        setMistakes(mistakeCount(category));
    }, [category]);

    const catPath = category.toLowerCase();

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-end">
                <ThemeToggle />
            </div>

            <Status category={category} />

            <div className="flex flex-col w-full max-w-xs gap-3 mt-6">
                <Link
                    to={`/category-${catPath}`}
                    className="text-center bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded">
                    {t('practice')}
                </Link>
                <Link
                    to={`/exam-${catPath}`}
                    onClick={() => {
                        // Starting from the dashboard always means a fresh exam; the
                        // exam screen consumes this flag, so a reload (no flag) can
                        // instead offer to resume.
                        try { sessionStorage.setItem('examFresh', category); } catch (e) { /* ignore */ }
                    }}
                    className="text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-black font-bold py-3 px-4 rounded">
                    {t('mockExam')}
                </Link>
                {mistakes > 0 && (
                    <Link
                        to={`/review-${catPath}`}
                        className="text-center bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800 dark:text-amber-100 text-amber-900 font-bold py-3 px-4 rounded">
                        {t('reviewMistakes')} ({mistakes})
                    </Link>
                )}
            </div>

            <Settings
                category={category}
                onCategoryChange={handleCategoryChange}
                language={language}
                onLanguageChange={handleLanguageChange}
            />

            <footer className="mt-4 mb-6 text-xs text-gray-400 dark:text-gray-500 text-center">
                <p className="mb-2">{t('disclaimer')}</p>
                <p className="mb-1">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="hover:text-gray-600 dark:hover:text-gray-300 underline">
                        {copied ? t('linkCopied') : `${t('share')} 📤`}
                    </button>
                </p>
                <p>
                    <a
                        href={REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-600 dark:hover:text-gray-300 underline">
                        GitHub ⭐
                    </a>
                    <span> · v{version}</span>
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
