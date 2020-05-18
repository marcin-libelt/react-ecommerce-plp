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
        const filters = filter["filter_items"].reduce((acc, cur, index) => {
            acc[index] = {
                label: cur.label,
                code: parseInt(cur["value_string"]),
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
        let code = this.state.filters[item].code;
        if(this.props.filter["request_var"] !== "size") {
            return (
                <li key={index} className={isSelected ? 'active' : ''}>
                    <input type={'checkbox'}
                           title={this.state.filters[item].label}
                           checked={isSelected}
                           onChange={(event) => this.props.onFiltersUpdate(code, this.props.filter["request_var"], event)}
                           id={index + '-' + code}/>
                    <label htmlFor={index + '-' + code}>{this.state.filters[item].label}</label>
                </li>
            )
        } else {
            return (
                <li key={index} className={isSelected ? 'active' : ''}>
                    <button type={'button'}
                            aria-selected={isSelected}
                            className={isSelected ? 'is-selected' : ''}
                            onClick={(event) => this.props.onFiltersUpdate(code, this.props.filter["request_var"], event)}>
                        <span>{this.state.filters[item].label}</span>
                    </button>
                </li>
            )
        }
    };

    createAllToggle = () => {
        const code = 'all';
        const index = parseInt(Math.random()*10000);
        const isSelected = !this.props.selectedFilters.length > 0;

        const clsNamesArr = [
            'clear-all-section',
            isSelected ? 'active' : ''
        ];

        console.log(this.props.filter["request_var"]);

        if(this.props.filter["request_var"] !== "size") {
            return (<li key={index} className={clsNamesArr.join(' ')}>
                <input type={'checkbox'}
                       title={'All'}
                       checked={isSelected}
                       onChange={() => this.props.onShowAll(this.props.filter["request_var"])}
                       id={index + '-' + code}/>
                <label htmlFor={index + '-' + code}>{'All'}</label>
            </li>);
        } else {
            return (<li key={index} className={clsNamesArr.join(' ')}>
                <button type={'button'}
                        aria-selected={isSelected}
                        className={isSelected ? 'is-selected' : ''}
                        onClick={() => this.props.onShowAll(this.props.filter["request_var"])}>
                    <span>{'All'}</span>
                </button>
            </li>);
        }

    }

    render() {
        return <ul>
          {this.createFormFields()}
          {this.createAllToggle()}
        </ul>
    };
}

List.propTypes = {
    filter: PropTypes.object.isRequired,
    onShowAll: PropTypes.func.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    selectedFilters: PropTypes.array
};

export default List;