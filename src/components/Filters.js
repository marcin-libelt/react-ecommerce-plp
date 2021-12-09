import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { gql } from 'apollo-boost';
import List from "./filters/List";
import PriceSlider from "./filters/PriceSlider";
import LoaderMask from "./LoaderMask";
import PerfectScrollbar from 'react-perfect-scrollbar'

const components = {
    filter_color: List,
    filter_heel_height: List,
    shoestyle: List,
    size: List
};

const Header = (props) => {

    let header;
    if(props.requestVar !== "price") {
        header = <a href="#"
           aria-expanded={!props.collapsed}
           onClick={(event) => { event.preventDefault(); props.onHeaderClick(props.requestVar)}}>
            <span className={'visually-hidden'}>{'filter by:'}</span>
            <span>{props.title}</span>
            {props.counter}
            <i className={'chevron'} aria-hidden={true}>&nbsp;</i>
        </a>
    } else {
        header = <span>
            <span>{props.title}</span>
        </span>
    }

    return <div className={'header'}>
        {header}
    </div>
};

class Filters extends React.Component {

    constructor(props) {

        super(props);
        this.onHeaderClick = this.onHeaderClick.bind(this);

        this.state = {
            filters: null,
            currentFilterPanel: "size",
            filtersDropdownVisible: false,
            sortDropdownVisible: false,
            currencySymbol: ""
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
          currency {
                base_currency_symbol
          }
        }
        `;
    }

    componentDidMount() {
        this.client
            .query({
                query: this.FILTERS,
                context: {
                    headers: {
                        Store: this.props.gqlParams.storeCode
                    }
                }
            })
            .then(result => {
                this.setState({
                    filters: result.data["discountCatalogFilters"].filters,
                    currencySymbol: result.data["currency"]["base_currency_symbol"]
                });
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
        requestVar === this.state.currentFilterPanel ? requestVar = null : requestVar;
        this.setState({
            currentFilterPanel: requestVar
        });
    }

    getPriceFilterItem = (filterVarCode) => this.state.filters.find(filterItems => filterItems.request_var === filterVarCode);

    createFilters = () => this.state.filters.map(this.createFilter);

    createFilter = (item, index) => {
        const { selectedFilters, onFiltersUpdate, onShowAll } = this.props;

        if(typeof components[item.request_var] !== "undefined") {

            const SpecificFilter = components[item.request_var];
            const classNamesArray = [
                'filter-box',
                !this.getCounter(item.request_var) ? 'clean' : '',
                'box-' + item.request_var,
                this.state.currentFilterPanel !== item.request_var ? 'collapsed' : ''
            ];

            return <div key={index}
                        className={classNamesArray.join(' ')}>
                        <Header title={item.name}
                                requestVar={item.request_var}
                                counter={this.getCounter(item.request_var)}
                                onHeaderClick={this.onHeaderClick}
                                collapsed={this.state.currentFilterPanel !== item.request_var}
                        />
                        <SpecificFilter filter={item}
                                        selectedFilters={selectedFilters[item.request_var] ? selectedFilters[item.request_var] : []}
                                        onShowAll={onShowAll}
                                        onFiltersUpdate={onFiltersUpdate} />
                    </div>
        }
    };

    getPriceForInput = () => {
        if(typeof this.props.selectedFilters["price"] === "undefined") {
            return {}
        } else {
            return {
                min: parseInt(this.props.selectedFilters["price"][0]),
                max: parseInt(this.props.selectedFilters["price"][1])
            }
        }
    };

    renderPriceFilter() {
        const priceFilter = this.getPriceFilterItem("price");
        const isOnePrice = priceFilter.filter_items[0]["value_string"] === priceFilter.filter_items[1]["value_string"];

        return isOnePrice ? null : <PriceSlider filter={priceFilter}
                     price={this.getPriceForInput()}
                     currencySymbol={this.state.currencySymbol}
                     onFiltersUpdate={this.props.onFiltersUpdate}
        />;
    }

    render() {
        const clsNamesArr = [
            'filters-container',
            this.props.hidden ? 'mobile-hidden' : ''
        ];
        if(this.state.filters !== null) {
            return <PerfectScrollbar options={{"suppressScrollX": true}} >
                        <div className={clsNamesArr.join(' ')}>
                            {this.renderPriceFilter()}
                            {this.createFilters()}
                        </div>
                    </PerfectScrollbar>
        } else {
            return <LoaderMask  text={"filters file"}/>
        }
    }
}

Filters.propTypes = {
    filters: PropTypes.array.isRequired,
    gqlParams: PropTypes.object.isRequired,
    onShowAll: PropTypes.func.isRequired,
    onFiltersUpdate: PropTypes.func.isRequired,
    selectedFilters: PropTypes.object.isRequired,
    hidden: PropTypes.bool
};

export default Filters;

