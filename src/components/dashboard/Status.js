import React, { useState, useEffect } from 'react';
import { loadQuestions } from "../../lib/questions";
import { getProgress } from "../../lib/progress";
import { readiness } from "../../lib/readiness";
import { getStreak, accuracyStats } from "../../lib/stats";

function barColor(percent) {
    if (percent >= 80) return '#4caf50';
    if (percent >= 50) return '#f0ad4e';
    return '#e25c5c';
}

// Estimated probability of passing the real exam right now, for the selected
// category, plus a few study stats.
const Status = ({ category }) => {
    const [result, setResult] = useState(null);
    const [streak, setStreak] = useState(0);
    const [acc, setAcc] = useState(null);

    useEffect(() => {
        if (!category) return;
        let active = true;
        loadQuestions(category).then((questions) => {
            if (!active) return;
            const progress = getProgress(category);
            const mastery = (progress && progress.mastery) || {};
            setResult(readiness(questions, mastery));
            setStreak(getStreak().count);
            setAcc(accuracyStats(category));
        });
        return () => {
            active = false;
        };
    }, [category]);

    const percent = result ? Math.round(result.probability * 100) : 0;
    const toMaster = result ? result.total - result.mastered : 0;

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg text-center p-4 w-full max-w-xs">
            <h3>Exam readiness{category ? ` · Category ${category}` : ''}</h3>
            <p>
                <strong style={{ fontSize: '1.75rem' }}>{percent}%</strong>
                <br />
                likely to pass right now
            </p>
            <div className="bg-gray-200 dark:bg-gray-700 rounded mt-2" style={{ height: '16px', width: '100%' }}>
                <div
                    style={{
                        width: `${percent}%`,
                        background: barColor(percent),
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                    }}
                />
            </div>
            {result && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Mastered {result.mastered}/{result.total} · {toMaster} to go · seen {Math.round(result.coverage * 100)}%
                </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                🔥 {streak}-day streak
                {acc && acc.recent != null ? ` · recent ${Math.round(acc.recent * 100)}%` : ''}
                {acc && acc.overall != null ? ` · overall ${Math.round(acc.overall * 100)}%` : ''}
            </p>
        </div>
    );
};

export default Status;
