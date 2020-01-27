import React from 'react';
import PropTypes from 'prop-types';

class ProductItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

      const { name, canonical_url, price, special_price, category_image, small_image } = this.props.details;

      const styles = {
        textDecoration: 'line-through'
      };

      const isSpecialPrice = special_price && special_price.amount.value < price.regularPrice.amount.value;
      const clsName = isSpecialPrice ? 'price-box is-special-price' : 'price-box';

        const priceBox = <div className={clsName}>
                        <p className="regularPrice" style={ isSpecialPrice ? styles : {}}>
                            {price.regularPrice.amount.value} {price.regularPrice.amount.currency}
                        </p>
                        { isSpecialPrice ? <p className="specialPrice">
                            {special_price.amount.value} {special_price.amount.currency}
                        </p> : '' }
                     </div>;

        return <li className={'product-item'}>
          <a href={canonical_url}>
            <img src={category_image} alt={small_image.label} />
            <div className={'product-details'}>{name} {priceBox}</div>
          </a>
      </li>
  }
}

ProductItem.propTypes = {
    details: PropTypes.object.isRequired
};

export default ProductItem;
