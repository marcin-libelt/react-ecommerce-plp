import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { gql } from 'apollo-boost';
import List from "./filters/List";
import PriceSlider from "./filters/PriceSlider";

const components = {
    filter_color: List,
    filter_heel_height: List,
    shoestyle: List,
    size: List,
    price: PriceSlider
};

const Header = (props) => {

    return <div className={'header'}>
        <a href="#"
           aria-expanded={!props.collapsed}
           onClick={(event) => props.onHeaderClick(props.requestVar)}>
            <span>{props.title}</span>
            {props.counter}
            <i className={'chevron'}>&nbsp;</i>
        </a>
    </div>
};

class Filters extends React.Component {

    constructor(props) {

        super(props);
        this.onHeaderClick = this.onHeaderClick.bind(this);

        this.state = {
            filters: [],
            filtersCollapsedStatus: {}
        };

        this.client = new ApolloClient({
            uri: this.props.gqlParams.gql
        });

        this.FILTERS = gql`
        {
        discountCatalogFilters(category_id: ${this.props.gqlParams.categoryId}) {
            filters {
              name
              filter_items_count
              request_var
              filter_items {
                label
                value_string
                items_count
              }
            }
          } 
        }
        `;
        this.loadFilters();
    }

    loadFilters() {
        this.client
            .query({
                query: this.FILTERS
            })
            .then(result => {
                this.setState({filters: result.data["discountCatalogFilters"].filters});
            });
    }

    getCounter(request_var) {
        let counter = null;
        const optionsSelected = this.props.selectedFilters[request_var];
        if("undefined" === typeof optionsSelected || optionsSelected.length === 0) {
            counter = null;
        } else {
            counter = <span className={'counter'}>{optionsSelected.length}</span>
        }
        return counter;
    }

    onHeaderClick(requestVar) {
        this.setState(prevState => ({
            filtersCollapsedStatus: {
                ...prevState.filtersCollapsedStatus, [requestVar]: !prevState.filtersCollapsedStatus[requestVar]
            }
        }));
    }

    createFilters = () => this.state.filters.map(this.createFilter);

    createFilter = (item, index) => {
        const { selectedFilters, onFiltersUpdate } = this.props;

        if(typeof components[item.request_var] !== "undefined") {

            const SpecificFilter = components[item.request_var];
            const classNamesArray = [
                'filter-box',
                !this.getCounter(item.request_var) ? 'clean' : '',
                'box-' + item.request_var,
                this.state.filtersCollapsedStatus[item.request_var] ? 'collapsed' : ''
            ];

            return <div key={index}
                        className={classNamesArray.join(' ')}>
                        <Header title={item.name}
                                requestVar={item.request_var}
                                counter={this.getCounter(item.request_var)}
                                onHeaderClick={this.onHeaderClick}
                                collapsed={this.state.filtersCollapsedStatus[item.request_var]}
                        />
                        <SpecificFilter filter={item}
                                        selectedFilters={selectedFilters[item.request_var] ? selectedFilters[item.request_var] : []}
                                        onFiltersUpdate={onFiltersUpdate} />
                    </div>
        }
    };

    render() {
        return <div className={'filters-container'}>
            {this.createFilters()}
        </div>
    }
}

Filters.propTypes = {
    gqlParams: PropTypes.object.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    selectedFilters: PropTypes.object.isRequired
};

export default Filters;

