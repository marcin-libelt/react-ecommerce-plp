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
        let label = this.state.filters[item].label;
        let labelElement;

        if(label.length > 5) { // greater than 5 i.e. "one size" will be
            labelElement = <label htmlFor={index + '-' + code} className={'os'}><span>{label}</span></label>
        } else if(label.match(/^.*(\.|,)5$/) && this.props.filter["request_var"] === "size") {
            labelElement = <label htmlFor={index + '-' + code}><span className="fraction">{label.replace(/(\.|,)5/g, "")}&frac12;</span></label>;
        } else {
            labelElement = <label htmlFor={index + '-' + code}><span>{label}</span></label>
        }

        return (
            <li key={index} className={isSelected ? 'active' : ''}>
                <input type={'checkbox'}
                       title={label}
                       checked={isSelected}
                       onChange={(event) => this.props.onFiltersUpdate(code, this.props.filter["request_var"], event)}
                       id={index + '-' + code}
                />
                {labelElement}
            </li>
        )
    };

    createAllToggle = () => {
        const code = 'all';
        const index = parseInt(Math.random()*10000);
        const isSelected = !this.props.selectedFilters.length > 0;

        const clsNamesArr = [
            'clear-all-section',
            isSelected ? 'active' : ''
        ];

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
        return <fieldset>
            <legend className={'visually-hidden'}>{this.props.filter.name}</legend>
                <ul className={this.props.filter["request_var"] !== "size" ? '' : 'size-selector'}>
                  {this.createFormFields()}
                  {this.createAllToggle()}
                </ul>
            </fieldset>
    };
}

List.propTypes = {
    filter: PropTypes.object.isRequired,
    onShowAll: PropTypes.func.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    selectedFilters: PropTypes.array
};

export default List;