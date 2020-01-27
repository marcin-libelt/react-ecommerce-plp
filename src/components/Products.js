import React from 'react';
import PropTypes from 'prop-types';
import ProductItem from "./ProductItem";

const Products = function(props) {

    const { products } = props;

    if(products.length > 0) {
        return <ul className="products">
            {products.map((item, index) => <ProductItem key={index} details={item}/>)}
        </ul>
    } else {
        return <div>Sorry no products found :(</div>
    }
};

Products.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object)
};

export default Products;