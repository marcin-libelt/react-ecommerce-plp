import React from 'react';
import PropTypes from 'prop-types';

const SortersZoom = (props) => {

    const sorters = {
        created_at: 'Latest',
        high: 'High',
        low: 'Low',
        position: 'Relevance'
    };

    const CreateSorter = (item, index) => {
        return <li key={index}>
            <div className={'visually-hidden'}>
                {`Page content will be updated upon selection of this ${sorters[item]} sorter`}
            </div>
            <input type={'radio'}
                   title={sorters[item]}
                   id={'sort-' + item}
                   name={'filterby'}
                   value={sorters[item]}
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
            <a href="#" onClick={(event) => { event.preventDefault(); props.onSetZoom(-1)}} className={'down'}><span>decrease image size</span></a>
            <a href="#" onClick={(event) => { event.preventDefault(); props.onSetZoom(1)}} className={'up'}><span>increase image size</span></a>
        </div>
        <div className={'small-label'}>
            {'Sort by'}
        </div>
        <fieldset>
            <legend className={'visually-hidden'}>{'Filter products by:'}</legend>
            <ul className={'sorters'}>
                <CreateSorters />
            </ul>
        </fieldset>
    </div>
};

SortersZoom.propTypes = {
    onSetSorters: PropTypes.func,
    onSetZoom: PropTypes.func,
    hidden: PropTypes.bool,
    currentSorter: PropTypes.string
};

export default SortersZoom;