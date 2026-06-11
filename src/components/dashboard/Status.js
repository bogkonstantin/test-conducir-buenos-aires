import React, { useState, useEffect } from 'react';
import { getCategoryFromStorage } from "../../lib/category";
import { getQuestions } from "../../lib/questions";
import { getProgress } from "../../lib/progress";
import { readiness } from "../../lib/readiness";

function barColor(percent) {
    if (percent >= 80) return '#4caf50';
    if (percent >= 50) return '#f0ad4e';
    return '#e25c5c';
}

// Estimated probability of passing the real exam right now, for the selected category.
const Status = () => {
    const [category, setCategory] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const cat = getCategoryFromStorage();
        if (!cat) return;
        setCategory(cat);
        const progress = getProgress(cat);
        const mastery = (progress && progress.mastery) || {};
        setResult(readiness(getQuestions(cat), mastery));
    }, []);

    const percent = result ? Math.round(result.probability * 100) : 0;

    return (
        <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px', width: '250px', textAlign: 'center' }}>
            <h3>Exam readiness{category ? ` · Category ${category}` : ''}</h3>
            <p>
                <strong style={{ fontSize: '1.75rem' }}>{percent}%</strong>
                <br />
                likely to pass right now
            </p>
            <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '16px', width: '100%', marginTop: '8px' }}>
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
                <p className="text-xs text-gray-500" style={{ marginTop: '8px' }}>
                    Mastered {result.mastered}/{result.total} · seen {Math.round(result.coverage * 100)}%
                </p>
            )}
        </div>
    );
};

export default Status;
