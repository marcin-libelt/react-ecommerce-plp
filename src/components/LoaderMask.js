import React from 'react';

const LoaderMask = ({text}) => {

    return <div data-role="filters-loader" className="loading-mask">
        <div className="loader">{text}</div>
    </div>
};

export default LoaderMask;