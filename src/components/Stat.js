import * as React from 'react';
import { t } from "../lib/ui";

const Stat = ({stat}) => {
    return (
        <>
            <div className="text-xs text-gray-500 dark:text-slate-400 tnum">
                {t('questionsLabel')}: <span className="font-semibold text-gray-700 dark:text-slate-200">{stat.total}</span>
                {' · '}{t('masteredLabel')}*: <span className="font-semibold text-brand-600 dark:text-brand-400">{stat.total - stat.queued}</span>
            </div>
            <div className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                *{t('masteredNote')}
            </div>
        </>
    );
};

export default Stat;
