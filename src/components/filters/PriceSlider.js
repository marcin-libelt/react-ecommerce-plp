import React from 'react'
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';

class PriceSlider extends React.Component  {

    constructor(props) {
        super(props);

        this.state = {
            min: 0,
            max: 0
        }
    };

    onPriceSelectorChange = (value) => {
        this.setState({
            min: value.min,
            max: value.max
        });
        this.props.onFiltersUpdate(value, this.props.filter["name"]);
    };

    isPriceSet = () => {
        const res = Object.keys(this.props.price).length === 0 && this.props.price.constructor === Object;
        return !res;
    };

    baseRange = this.props.filter["filter_items"].reduce((acc, cur) => {
        acc[cur.label] = parseInt(cur["value_string"]);
        return acc;
    }, {});

    render() {

        const priceValue = !this.isPriceSet() ? this.baseRange : this.props.price;
        const labelMin = this.state.min || priceValue.min;
        const labelMax = this.state.max || priceValue.max;

        return <div className={'filter-box price-filter'}>
            <div className={'header'}>{'Price'}</div>
            <span className={'label-min'}>{this.props.currencySymbol}{labelMin}</span>
            <InputRange
                minValue={this.baseRange.min}
                maxValue={this.baseRange.max}
                value={priceValue}
                onChange={this.onPriceSelectorChange}
            />
            <span className={'label-max'}>{this.props.currencySymbol}{labelMax}</span>
        </div>
    }

}

PriceSlider.propTypes = {
    filter: PropTypes.object.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    price: PropTypes.object,
    currencySymbol: PropTypes.string.isRequired
};

export default PriceSlider;