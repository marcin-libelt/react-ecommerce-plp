import React from 'react';
import PropTypes from 'prop-types';
import ProductItem from "./ProductItem";
import LoaderMask from "./LoaderMask";

const Products = function(props) {

    const { products, currencySymbol, loadingComplete } = props;

    let circles = [];
    for(let i = 0; i < 20; i++) {
        circles.push(<div className="circle" key={i}></div>);
    }

    if(loadingComplete) {
        if(products.length > 0) {
            return <ul className="products">
                {products.map((item, index) => <ProductItem key={index}
                                                            details={item}
                                                            currencySymbol={currencySymbol}/>)}
            </ul>
        } else {
            return <React.Fragment>
                <p className={'no-results'}>Sorry, no results match your filters.</p>
                <canvas id="canvas-bubble"></canvas>
                <div className="wrapper">
                    <div className="circles">
                        { circles }
                    </div>
                </div>
            </React.Fragment>;
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