import React from 'react';
import PropTypes from 'prop-types';
import ProductItem from "./ProductItem";
import LoaderMask from "./LoaderMask";

const Products = function(props) {

    const { products, currencySymbol, loadingComplete } = props;

    if(loadingComplete) {
        if(products.length > 0) {
            return <ul className="products">
                {products.map((item, index) => <ProductItem key={index}
                                                            details={item}
                                                            currencySymbol={currencySymbol}/>)}
            </ul>
        } else {
            return <div>Sorry no products found :(</div>
        }
    } else {
        return <React.Fragment>
            <ul className="products">
            {products.map((item, index) => <ProductItem key={index}
                                                        details={item}
                                                        currencySymbol={currencySymbol}/>)}
            </ul>
            <LoaderMask/>
        </React.Fragment>
    }
};

Products.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object),
    currencySymbol: PropTypes.string.isRequired,
    loadingComplete: PropTypes.bool
};

export default Products;