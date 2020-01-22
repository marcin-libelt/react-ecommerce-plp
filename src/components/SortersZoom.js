import React from 'react';
import PropTypes from 'prop-types';

const SortersZoom = (props) => {

    const sorters = {
        latest: 'Latest',
        high: 'High',
        low: 'Low',
        relevance: 'Relevance'
    };

    const CreateSorter = (item, index) => {
        return <li key={index}>
            <input type={'radio'}
                   title={sorters[item]}
                   id={'sort-' + item}
                   checked={props.currentSorter === item}
                   onChange={() => props.onSetSorters(item)}/>
            <label htmlFor={'sort-' + item}>{sorters[item]}</label>
        </li>;
    };

    const CreateSorters = () => Object.keys(sorters).map(CreateSorter);

    const clsNamesArr = [
        'sorters-zoom',
        props.hidden ? 'mobile-hidden' : ''
    ];

    return <div className={clsNamesArr.join(' ')}>
        <div className={'zoom'}>
            <span>{'Zoom'}</span>
            <a href="#" onClick={() => props.onSetZoom(-1)} className={'down'}><span>decrease image size</span></a>
            <a href="#" onClick={() => props.onSetZoom(1)} className={'up'}><span>increase image size</span></a>
        </div>
        <div className={'small-label'}>
            {'Sort by'}
        </div>
        <ul className={'sorters'}>
            <CreateSorters />
        </ul>
    </div>
};

SortersZoom.propTypes = {
    onSetSorters: PropTypes.func,
    onSetZoom: PropTypes.func,
    hidden: PropTypes.bool,
    currentSorter: PropTypes.string
};

export default SortersZoom;