import React from 'react';

const Status = () => {
    const memorizedPercent = 10;

    return (
        <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px', width: '250px', textAlign: 'center' }}>
            <h3>Status</h3>
            <p>
                <strong>{memorizedPercent}%</strong> questions are memorized.
            </p>
            <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '16px', width: '100%', marginTop: '8px' }}>
                <div
                    style={{
                        width: `${memorizedPercent}%`,
                        background: '#4caf50',
                        height: '100%',
                        borderRadius: '4px'
                    }}
                />
            </div>
        </div>
    );
};

export default Status;