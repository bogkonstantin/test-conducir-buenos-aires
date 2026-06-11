import * as React from 'react';
import { t } from "../lib/ui";

const Stat = ({stat}) => {
    return (
        <>
            <div className="text-xs">
                {t('questionsLabel')}: {stat.total},
                {' '}{t('masteredLabel')}*: {stat.total - stat.queued}
            </div>
            <div className="text-xs">
                <small>*{t('masteredNote')}</small>
            </div>
        </>
    );
};

export default Stat;
