import React from 'react';

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

export default FiltersActions;