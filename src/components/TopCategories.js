import React from 'react';
import PropTypes from 'prop-types';

const TopCategories = (props) => {

    const createCategories = () => props.categories.map(createCategoryItem);

    const createCategoryItem = (item, index) => {
        return <li key={index} className={item.isActive ? 'active' : ''}>
            <a href={item.url}>{item.label}</a>
        </li>;
    };

    return <div className={'categories'}>
        <ul>
            {createCategories()}
        </ul>
    </div>
};

TopCategories.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object)
};

export default TopCategories;