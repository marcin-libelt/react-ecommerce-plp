import React from 'react'
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';

class PriceSlider extends React.Component {

    constructor(props) {
        super(props);

        this.onPriceSelectorChange = this.onPriceSelectorChange.bind(this);

        const priceRange = this.props.filter["filter_items"].reduce((acc, cur) => {
            acc[cur.label] = parseInt(cur["value_string"]);
            return acc;
        }, {});

        this.state = {
            priceRange,
            currentRangeSelection: priceRange,
        };
    }

    componentDidMount() {
        const { selectedFilter } = this.props;
        if(selectedFilter.length === 2) {
            this.setState({
                currentRangeSelection: {
                    min: parseInt(selectedFilter[0]),
                    max: parseInt(selectedFilter[1])
                }
            });
        }
    }

    onPriceSelectorChange(value) {
        this.props.onFiltersUpdate(value, this.props.filter["name"]);
    }

    render() {
        return <div className={'filter-box price-filter'}>
            <div className={'header'}>{'Price'}</div>
            <InputRange
                maxValue={this.state.priceRange["max"]}
                minValue={this.state.priceRange["min"]}
                value={this.state.currentRangeSelection}
                onChange={(value) => this.setState({ currentRangeSelection: value })}
                onChangeComplete={() => this.onPriceSelectorChange(this.state.currentRangeSelection)} />
        </div>
    }
}

PriceSlider.propTypes = {
    filter: PropTypes.object.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    selectedFilter: PropTypes.array
};

export default PriceSlider;