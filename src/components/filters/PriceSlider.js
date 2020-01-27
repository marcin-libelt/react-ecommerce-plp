import React from 'react'
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';

const PriceSlider = (props) => {

    const onPriceSelectorChange = (value) => {
        props.onFiltersUpdate(value, props.filter["name"]);
    }

    const isPriceSet = () => {
        const res = Object.keys(props.price).length === 0 && props.price.constructor === Object;
        return !res;
    }

    const baseRange = props.filter["filter_items"].reduce((acc, cur) => {
        acc[cur.label] = parseInt(cur["value_string"]);
        return acc;
    }, {});

    const price = !isPriceSet() ? baseRange : props.price;

    return <div className={'filter-box price-filter'}>
        <div className={'header'}>{'Price'}</div>
        <InputRange
            minValue={baseRange.min}
            maxValue={baseRange.max}
            value={price}
            onChange={onPriceSelectorChange}
             />
    </div>
}

PriceSlider.propTypes = {
    filter: PropTypes.object.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    price: PropTypes.object
};

export default PriceSlider;