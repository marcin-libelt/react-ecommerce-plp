import React from 'react';
import ProductItem from "./ProductItem";

const Products = function(props) {

    const { products } = props;

    return <ul className="products">
        {products.map((item, index) => <ProductItem key={index} details={item} />)}
    </ul>
};


export default Products;