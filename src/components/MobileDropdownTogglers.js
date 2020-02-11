import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FiltersActions from "./FiltersActions";

const MobileDropdownTogglers = (props) => {

    const [isLocked, setIsLocked] = useState(false);
    let vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const elem = document.querySelector('.column.main');

    useEffect(() => {
        document.addEventListener('scroll', setButtonPosition);
        window.addEventListener('resize', () => {
            vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        });
    });

    const setButtonPosition = () => {
        const result = (vH >= elem.getBoundingClientRect().bottom);
        setIsLocked(result);
    };

    const clsForFiltersArr = [
        'for-filters',
        props.dropdownStatus === 'filters' ? 'active' : ''
    ];

    const clsForSortersArr = [
        'for-sort',
        props.dropdownStatus === 'sorters' ? 'active' : ''
    ];

    const clsNamesArr = [
        'mobile-triggers',
        isLocked ? 'un-fixed' : ''
    ];

    return  <div className={clsNamesArr.join(' ')}>
        <div className={clsForFiltersArr.join(' ')}>
            <div className={'label'}>{'Filters'}</div>
            <FiltersActions onFiltersSubmit={props.onFiltersSubmit}
                            onFiltersClear={props.onFiltersClear}
                            hidden={props.dropdownStatus !== 'filters'}
                            userFiltersSelected={props.userFiltersSelected}
                            userFiltersSubmited={props.userFiltersSubmited}
            />
            <a href={'#'}
               className={'toggle'}
               aria-expanded={props.dropdownStatus === 'filters'}
               onClick={(event) => { event.preventDefault(); props.onDropdownToggle('filters')}}>
                <i className={'chevron'}></i>
            </a>
        </div>
        <a href={'#'}
           className={clsForSortersArr.join(' ')}
           aria-expanded={props.dropdownStatus === 'sorters'}
           onClick={(event) => { event.preventDefault(); props.onDropdownToggle('sorters')}}>
            {'Sort'}
        </a>
    </div>
};

MobileDropdownTogglers.propTypes = {
    onFiltersSubmit: PropTypes.func.isRequired,
    onFiltersClear: PropTypes.func,
    onDropdownToggle: PropTypes.func,
    dropdownStatus: PropTypes.string,
    userFiltersSelected: PropTypes.bool,
    userFiltersSubmited: PropTypes.bool
};

export default MobileDropdownTogglers;