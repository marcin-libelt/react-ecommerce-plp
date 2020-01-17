import React from 'react';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: {}
        }
    }

    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    UNSAFE_componentWillReceiveProps(newProps) {
        this.selectSelectedOptions(newProps);
        console.log('component Will Receive Props');
    }

    componentDidMount() {
        this.selectSelectedOptions(this.props);
    }

    selectSelectedOptions(props) {
        const { filter, selectedFilters } = props;

        const filters = filter["filter_items"].reduce((acc, cur) => {
            acc[cur["value_string"]] = {
                label: cur.label,
                selected: selectedFilters.indexOf(cur["value_string"]) != -1 ? true : false
            };
            return acc;
        }, {});

        this.setState({ filters });
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
                           onChange={(event) => this.props.onFiltersUpdate(item, this.props.filter["request_var"])}
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
                            onClick={(event) => this.props.onFiltersUpdate(item, this.props.filter["request_var"])}>
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

export default List;