import React from 'react';
import PropTypes from 'prop-types';

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: {}
        }
    }

    static getDerivedStateFromProps = (props, state) => {
        const { filter, selectedFilters } = props;
        const filters = filter["filter_items"].reduce((acc, cur) => {
            acc[cur["value_string"]] = {
                label: cur.label,
                selected: selectedFilters.indexOf(cur["value_string"]) != -1 ? true : false
            };
            return acc;
        }, {});

        return {
            filters
        }
    }

    createFormFields = () => Object.keys(this.state.filters).map(this.createField);

    createField = (item, index) => {
        const isSelected = this.state.filters[item].selected;
        if(this.props.filter["request_var"] !== "size") {
            return (
                <li key={index} className={isSelected ? 'active' : ''}>
                    <input type={'checkbox'}
                           title={this.state.filters[item].label}
                           checked={isSelected}
                           onChange={(event) => this.props.onFiltersUpdate(item, this.props.filter["request_var"], event)}
                           id={index + '-' + item}/>
                    <label htmlFor={index + '-' + item}>{this.state.filters[item].label}</label>
                </li>
            )
        } else {
            return (
                <li key={index} className={isSelected ? 'active' : ''}>
                    <button type={'button'}
                            aria-selected={isSelected}
                            className={isSelected ? 'is-selected' : ''}
                            onClick={(event) => this.props.onFiltersUpdate(item, this.props.filter["request_var"], event)}>
                        <span>{this.state.filters[item].label}</span>
                    </button>
                </li>
            )
        }
    };

    render() {
        return <ul>
          {this.createFormFields()}
        </ul>
    };
}

List.propTypes = {
    filter: PropTypes.object.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    selectedFilters: PropTypes.array
};

export default List;