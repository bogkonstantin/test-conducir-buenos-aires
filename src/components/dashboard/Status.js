import React, { useState, useEffect } from 'react';
import { loadQuestions } from "../../lib/questions";
import { getProgress } from "../../lib/progress";
import { readiness } from "../../lib/readiness";
import { accuracyStats } from "../../lib/stats";
import { t } from "../../lib/ui";

function barColor(percent) {
    if (percent >= 80) return '#12b76a';
    if (percent >= 50) return '#f79009';
    return '#f04438';
}

// Estimated probability of passing the real exam right now, for the selected
// category, plus a few study stats.
const Status = ({ category }) => {
    const [result, setResult] = useState(null);
    const [acc, setAcc] = useState(null);

    useEffect(() => {
        if (!category) return;
        let active = true;
        loadQuestions(category).then((questions) => {
            if (!active) return;
            const progress = getProgress(category);
            const mastery = (progress && progress.mastery) || {};
            setResult(readiness(questions, mastery));
            setAcc(accuracyStats(category));
        });
        return () => {
            active = false;
        };
    }, [category]);

    const percent = result ? Math.round(result.probability * 100) : 0;
    const toMaster = result ? result.total - result.mastered : 0;

    return (
        <div className="surface-inset text-center px-5 py-6 w-full max-w-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                {t("examReadiness")}{category ? ` · ${t("category")} ${category}` : ''}
            </h3>
            <div className="mt-2 mb-1">
                <span className="font-display font-extrabold leading-none tracking-tight text-gray-900 dark:text-white tnum"
                      style={{ fontSize: '3rem' }}>{percent}<span className="text-2xl align-top text-gray-400 dark:text-slate-500">%</span></span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">{t("likelyToPass")}</p>
            <div className="bg-gray-200 dark:bg-slate-700/70 rounded-full overflow-hidden mt-4" style={{ height: '10px', width: '100%' }}>
                <div
                    style={{
                        width: `${percent}%`,
                        background: barColor(percent),
                        height: '100%',
                        borderRadius: '9999px',
                        transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
                    }}
                />
            </div>
            {result && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-3 tnum">
                    {t("masteredStat")} {result.mastered}/{result.total} · {toMaster} {t("toGo")} · {t("seen")} {Math.round(result.coverage * 100)}%
                </p>
            )}
            {acc && (acc.recent != null || acc.overall != null) && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 tnum">
                    {acc.recent != null ? `${t("recentLabel")} ${Math.round(acc.recent * 100)}%` : ''}
                    {acc.recent != null && acc.overall != null ? ' · ' : ''}
                    {acc.overall != null ? `${t("overallLabel")} ${Math.round(acc.overall * 100)}%` : ''}
                </p>
            )}
        </div>
    );
};

export default Status;
