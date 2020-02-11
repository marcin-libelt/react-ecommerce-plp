import React from 'react';

const LoaderMask = (props) => {

    const sorters = {
        created_at: 'Latest',
        high: 'High',
        low: 'Low',
        position: 'Relevance'
    };

    return <div data-role="filters-loader" className="loading-mask">
        <div className="loader"></div>
    </div>
};

export default LoaderMask;