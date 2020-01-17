import React from 'react'
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
        const { filter, selectedFilters } = this.props;

        const priceRange = filter["filter_items"].reduce((acc, cur) => {
            acc[cur.label] = parseInt(cur["value_string"]);
            return acc;
        }, {});
        this.setState({ priceRange });
    }

    onPriceSelectorChange(value) {
        //console.log(value);
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

export default PriceSlider;