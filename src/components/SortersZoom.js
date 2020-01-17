import React from 'react';

export default function (props) {

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

    return <div className={'sorters-zoom'}>
        <div className={'zoom'}>
            <span>{'Zoom'}</span>
            <a href="#" onClick={() => props.onSetZoom(-1)} className={'down'}><span>decrease image size</span></a>
            <a href="#" onClick={() => props.onSetZoom(1)} className={'up'}><span>increase image size</span></a>
        </div>
        <ul className={'sorters'}>
            <CreateSorters />
        </ul>
    </div>
}