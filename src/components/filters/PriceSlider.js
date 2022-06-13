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

    handleChange = (event, extremum) => {
        let data = {};
        const value = event.target.value === "" ? 0 : parseInt(event.target.value);

        switch (extremum) {
            case "min":
                data.min = value;
                data.max = this.state.max;
            break;
            case "max":
                data.min = this.state.min;
                data.max = value;
            break;
        }

        this.setState(data);
        this.props.onFiltersUpdate(data, this.props.filter["name"]);
    };

    render() {

        const priceValue = !this.isPriceSet() ? this.baseRange : this.props.price;
        const labelMin = this.state.min || priceValue.min;
        const labelMax = this.state.max || priceValue.max;

        return <div className={'filter-box price-filter'}>
            <div className={'header'}>
                {'Price'}
                <span className='sr-only'>
                    Product price range selector
                </span>
            </div>

            <div className='label-min'>
                <label htmlFor="price-min" className='sr-only'>minimum price of the product</label>
                <span>{this.props.currencySymbol}</span>
                <input id='price-min' onChange={event => this.handleChange(event, 'min')} value={labelMin} />
            </div>
            <div className='label-max' style={{'width': labelMax > 999 ? '43px' : '36px' }}>
                <label htmlFor="price-max" className='sr-only'>maximum price of the product</label>
                <span>{this.props.currencySymbol}</span>
                <input id='price-max' onChange={event => this.handleChange(event, 'max')} value={labelMax} />
            </div>
            <div aria-hidden={'true'}>
                <InputRange
                    minValue={this.baseRange.min}
                    maxValue={this.baseRange.max}
                    value={priceValue}
                    step={10}
                    onChange={this.onPriceSelectorChange}
                />
            </div>
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