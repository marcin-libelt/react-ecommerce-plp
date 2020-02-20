import React from 'react';
import PropTypes from 'prop-types';

class ProductItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

      const { name, canonical_url, price, category_image, small_image } = this.props.details;
      const isSpecialPrice = price.minimalPrice.amount.value < price.regularPrice.amount.value;
      const clsNameArr = [
          'price-box',
          isSpecialPrice ? 'is-special-price' : ''
      ];

      const percentage = isSpecialPrice ? (price.minimalPrice.amount.value / price.regularPrice.amount.value) * 100 : 0;
      const priceBox = <div className={clsNameArr.join(" ")}>
        {name}
        <span className="specialPrice" >{ price.minimalPrice.amount.value }</span>
        { isSpecialPrice ? <p className={'regularPrice'}><span className={'old-price'}>{ price.regularPrice.amount.value }</span>{ percentage + '% off'}</p> : ''}
      </div>;

      return <li className={'product-item'}>
          <a href={canonical_url}>
            <img src={category_image} alt={small_image.label} />
            <div className={'product-details'}>
                {priceBox}
            </div>
          </a>
      </li>
  }
}

ProductItem.propTypes = {
    details: PropTypes.object.isRequired
};

export default ProductItem;
