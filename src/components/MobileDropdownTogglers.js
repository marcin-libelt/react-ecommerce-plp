import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FiltersActions from "./FiltersActions";

function MobileDropdownTogglers(props) {

    const clsForFiltersArr = [
        'for-filters',
        props.dropdownStatus === 'filters' ? 'active' : ''
    ];

    const clsForSortersArr = [
        'for-sort',
        props.dropdownStatus === 'sorters' ? 'active' : ''
    ];

    return  <div className={'mobile-triggers'}>
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
                <span className={'visually-hidden'}>{'Filters toggler'}</span>
            </a>
        </div>
        <a href={'#'}
           aria-label={'Sorters toggler'}
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