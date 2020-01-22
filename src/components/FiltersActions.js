import React from 'react';
import PropTypes from 'prop-types';

const FiltersActions = (props) => {

    const clsNameArr = [
        'actions-toolbar',
        props.hidden ? 'mobile-hidden' : ''
    ];

    const clsNamesResetArr = [
        'action',
        'reset',
        props.userFiltersSubmited ? 'active' : ''
    ];
    const clsNamesSubmitArr = [
        'action',
        'submit',
        props.userFiltersSelected ? 'active' : ''
    ];

    return <div className={clsNameArr.join(' ')}>
        <button
            className={clsNamesResetArr.join(' ')}
            onClick={props.onFiltersClear}>{'clear'}</button>
        <button
            className={clsNamesSubmitArr.join(' ')}
            onClick={props.onFiltersSubmit}>{'apply'}</button>
    </div>
};

FiltersActions.propTypes = {
    onFiltersClear: PropTypes.func,
    onFiltersSubmit: PropTypes.func,
    hidden: PropTypes.bool,
    userFiltersSelected: PropTypes.bool,
    userFiltersSubmited: PropTypes.bool
};

export default FiltersActions;