import * as React from 'react';

const Stat = ({stat}) => {
    return (
        <>
            <div className="text-xs">
                вопросов: {stat.total},
                выучено*: {stat.total - stat.queued}
            </div>
            <div className="text-xs">
                <small>
                    *количество вопросов, на которые вы ответили правильно 3 раза подряд
                </small>
            </div>
        </>
    );
};

export default Stat;
