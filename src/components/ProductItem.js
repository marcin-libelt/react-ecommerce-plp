import React from 'react';

class ProductItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

      const { name, sku, url_suffix, url_key, price, image } = this.props.details;

      const styles = {
        textDecoration: 'line-through'
      };

      const isSpecialPrice = price.minimalPrice.amount.value < price.regularPrice.amount.value;
      const clsName = isSpecialPrice ? 'price-box is-special-price' : 'price-box';

      const priceBox = <div className={clsName}>
                        <p className="regularPrice" style={ isSpecialPrice ? styles : {}}>
                            {price.regularPrice.amount.value} {price.regularPrice.amount.currency}
                        </p>
                        { isSpecialPrice ? <p className="specialPrice">
                            {price.minimalPrice.amount.value} {price.minimalPrice.amount.currency}
                        </p> : '' }
                     </div>;

        return <li className={'product-item'}>
          <a href={url_key + '.html'}>
            <img src={image.url} alt={image.label} />
            <div className={'product-details'}>{name} {priceBox}</div>
          </a>
      </li>
  }
}

export default ProductItem;
