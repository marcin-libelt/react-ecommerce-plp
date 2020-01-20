import React from 'react';
import PropTypes from 'prop-types';

const FiltersActions = function(props) {
    return <div className={'actions-toolbar'}>
        <button
            className="action reset"
            onClick={props.onFiltersClear}>{'clear'}</button>
        <button
            className="action submit"
            onClick={props.onFiltersSubmit}>{'apply'}</button>
    </div>
};

FiltersActions.propTypes = {
    onFiltersClear: PropTypes.func,
    onFiltersSubmit: PropTypes.func
};

export default FiltersActions;