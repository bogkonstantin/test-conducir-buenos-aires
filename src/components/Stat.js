import * as React from 'react';

const Stat = ({stat}) => {
    return (
        <div className="text-xs">
            вопросов: {stat.total},
            выучено: {stat.total - stat.queued}
        </div>
    );
};

export default Stat;
