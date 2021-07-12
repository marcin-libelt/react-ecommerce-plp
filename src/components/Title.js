import React from 'react';
import PropTypes from 'prop-types';

const PageTitle = (props) => {

    const current = props.categories.find(category => category.isActive === true);
   // const createCategories = () => props.categories.map(createCategoryItem);

    return <h1 className={'visually-hidden'}>{`${current.label} category`}</h1>
};

PageTitle.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object)
};

export default PageTitle;