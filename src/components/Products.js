import React from 'react';
import PropTypes from 'prop-types';
import ProductItem from "./ProductItem";
import LoaderMask from "./LoaderMask";

const Products = function(props) {

    const { products, loadingComplete } = props;

    if(loadingComplete) {
        if(products.length > 0) {
            return <ul className="products">
                {products.map((item, index) => <ProductItem key={index} details={item}/>)}
            </ul>
        } else {
            return <div>Sorry no products found :(</div>
        }
    } else {
        return <React.Fragment>
            <ul className="products">
            {products.map((item, index) => <ProductItem key={index} details={item}/>)}
            </ul>
            <LoaderMask/>
        </React.Fragment>
    }
};

Products.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object),
    loadingComplete: PropTypes.bool
};

export default Products;