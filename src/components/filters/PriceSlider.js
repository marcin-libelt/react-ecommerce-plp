import React from 'react'
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';

class PriceSlider extends React.Component {

    constructor(props) {
        super(props);

        this.onPriceSelectorChange = this.onPriceSelectorChange.bind(this);

        this.state = {
            priceRange: { min: 2, max: 10 },
            currentRangeSelection: { min: 2, max: 10 },
        };
    }

    componentDidMount() {
        const { filter } = this.props;

        const priceRange = filter["filter_items"].reduce((acc, cur) => {
            acc[cur.label] = parseInt(cur["value_string"]);
            return acc;
        }, {});
        this.setState({ priceRange });
    }

    onPriceSelectorChange(value) {
        this.props.onFiltersUpdate(value, this.props.filter["name"]);
    }

    render() {
        return <InputRange
            maxValue={this.state.priceRange["max"]}
            minValue={this.state.priceRange["min"]}
            value={this.state.currentRangeSelection}
            onChange={value => this.setState({ currentRangeSelection: value })}
            onChangeComplete={() => this.onPriceSelectorChange(this.state.currentRangeSelection)} />
    }
}

PriceSlider.propTypes = {
    filter: PropTypes.object.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    selectedFilters: PropTypes.array
};

export default PriceSlider;