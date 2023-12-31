import React from 'react';
import PropTypes from 'prop-types';
import { priceCents } from '../helpers/price';

class ProductItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      const { name, url_key, url_suffix, price, category_image, small_image } = this.props.details;
      const isSpecialPrice = price.minimalPrice.amount.value < price.regularPrice.amount.value;
      const showDiscountMiddlePrice = price.discountMiddlePrice.amount.value < price.regularPrice.amount.value && price.discountMiddlePrice.amount.value >  price.minimalPrice.amount.value;
      const clsNameArr = [
          'product-essentials',
          isSpecialPrice ? 'has-special-price' : ''
      ];
      const clsNameArrNormalPrice = [
          'normal-price',
          isSpecialPrice ? 'is-discounted' : ''
      ];
      const percentage = isSpecialPrice ? (1 - (price.minimalPrice.amount.value / price.regularPrice.amount.value)) * 100 : 0;
      const priceBox = <div className={'price-box'}>
          <p className={clsNameArr.join(" ")}>
              <span className="product-name">{name}</span>
              <span className={clsNameArrNormalPrice.join(" ")}>{ this.props.currencySymbol + '' + priceCents(price.minimalPrice.amount.value) }</span>
          </p>

        { showDiscountMiddlePrice ? <React.Fragment>
          <span className={'old-price'}>{ this.props.currencySymbol + '' + priceCents(price.discountMiddlePrice.amount.value) }</span></React.Fragment> : ''
        }

        { isSpecialPrice ? <React.Fragment>
            <span className={'old-price'}>{ this.props.currencySymbol + '' + priceCents(price.regularPrice.amount.value) }</span>
            <span className="discount-percentage">{ Math.round(percentage) + '% off'}</span></React.Fragment> : ''}
      </div>;

      return <li className={'product-item'}>
          <a href={window.BASE_URL + url_key + url_suffix} aria-label={name + ' ' + this.props.currencySymbol + '' + priceCents(price.minimalPrice.amount.value) + '. Click to go to the product page.' }>
            <img src={category_image}  alt={''} aria-hidden={true} />
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
