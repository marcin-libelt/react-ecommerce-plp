import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { gql } from 'apollo-boost';
import SortersZoom from "./SortersZoom";
import Products from "./Products";
import Filters from "./Filters";
import TopCategories from "./TopCategories";
import MobileDropdownTogglers from './MobileDropdownTogglers';

const zoomRange = {
    min: 0,
    max: 2
};

const uriHashPrefix = 'categoryFilters!';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.onFiltersUpdate = this.onFiltersUpdate.bind(this);
        this.onFiltersClear = this.onFiltersClear.bind(this);
        this.onSetSorters = this.onSetSorters.bind(this);
        this.onSetZoom = this.onSetZoom.bind(this);
        this.onDropdownToggle = this.onDropdownToggle.bind(this);
        this.onFiltersSubmit = this.onFiltersSubmit.bind(this);

        this.state = {
            products: [],
            filters: null,
            selectedFilters: {},
            sort: 'relevance',
            zoom: 1,
            dropdown: null,
            userFiltersSelected: false,
            userFiltersSubmited: false
        };

        this.client = new ApolloClient({
            uri: this.props.parameter.gql
        });

        this.PRODUCTS = gql`
        { 
          category(id: ${this.props.parameter.categoryId}) {
            products {
              total_count
              page_info {
                current_page
                page_size
                total_pages
              }
              items {
                image {
                        url
                        label
                }
              sku
              name
              url_key
              special_price
              price {
                minimalPrice {
                  amount {
                    currency
                    value
                  }
                }
                regularPrice {
                  amount {
                    currency
                    value
                  }
                }
              }
          }
        }
        }
        }
        `;
        this.FILTERS = gql`
        {
        discountCatalogFilters(category_id: ${this.props.parameter.categoryId}) {
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
    }

    componentDidMount() {
        this.loadInitialProducts();
        this.loadFilters();
        this.filtersFromUri();
    }

    onSetSorters(sort) {
        this.setState({sort: sort});
    }

    handleClick() {

    }

    filtersFromUri() {
        const regex = RegExp(uriHashPrefix);
        if(regex.test(location.hash)) {
            let str = location.hash.replace(regex, '');
            str = str.replace('#', '');
            if(str.length > 0) {
                const recoveredFiltersState = this.decodeFilterUri(str);
                this.setState({
                    selectedFilters: recoveredFiltersState
                })
            }
        }
    }

    onFiltersUpdate(value, filterVarName) {

        // exception for Price filter
        if(filterVarName === "price") {
            const minMax = [value.min, value.max];
            this.setState(prevState => ({
                selectedFilters: { ...prevState.selectedFilters, "price": minMax }
            }), this.afterFiltersAction);
        } else {

            let selectedFilters;

            if ("undefined" === typeof this.state.selectedFilters[filterVarName]) {
                selectedFilters = {...this.state.selectedFilters};

                // create new filter placeholder if non existent
                // and add selected value ( option )
                selectedFilters[filterVarName] = [value];

                this.setState({
                    selectedFilters
                }, this.afterFiltersAction);

            } else {
                const index = this.state.selectedFilters[filterVarName].indexOf(value);

                // add or remove ?
                if (index !== -1) {
                    // remove
                    selectedFilters = [...this.state.selectedFilters[filterVarName]];
                    selectedFilters.splice(index, 1);
                    let prevFilters = {...this.state.selectedFilters};
                    let newState = {};

                    // remove entire filter
                    if(selectedFilters.length === 0) {
                        delete prevFilters[filterVarName];
                        newState = {
                            selectedFilters: prevFilters
                        };
                    } else {
                        newState = {
                            selectedFilters: {
                                ...prevFilters,
                                [filterVarName]: selectedFilters
                            }
                        };
                    }
                    this.setState(newState, this.afterFiltersAction);

                } else {
                    // add
                    selectedFilters = [...this.state.selectedFilters[filterVarName], value];
                    this.setState(prevState => ({
                        selectedFilters: {
                            ...prevState.selectedFilters,
                            [filterVarName]: selectedFilters
                        }
                    }), this.afterFiltersAction);
                }
            }
        }
    }

    afterFiltersAction() {
        //console.log(this.isAnyFiltersApplied());
    }

    isAnyFiltersApplied = () => !!Object.keys(this.state.selectedFilters).length;

    decodeFilterUri = (stringUri) => {
        const ar = decodeURIComponent(stringUri).split('&');
        return ar.reduce((acc, cur) => {
            const f = cur.split('=');
            acc[f[0]] = f[1].split(',');
            return acc;
        }, {});
    };

    encodeFilterUri = () => Object.entries(this.state.selectedFilters).map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join('&');

    /** Wysyła zapytanie GQL **/
    onFiltersSubmit() {
        // TODO: ogarnąc stany HASH'a
        alert('submited!');
        const queryString = this.encodeFilterUri();
        //const decoded = this.decodeFilterUri(queryString);
        location.hash = uriHashPrefix + queryString;
    }

    onFiltersClear() {
        // TODO: ogarnąc stany HASH'a
        location.hash = '';
        this.setState({
            selectedFilters: {},
            userFiltersSubmited: false,
            userFiltersSelected: false,
        }, this.onFiltersSubmit)
    }

    onDropdownToggle(type) {
        this.setState(prevState => ({
            dropdown: prevState.dropdown === type ? null : type
        }));
    }

    onSetZoom(value) {
        const currentZoom = this.state.zoom;
        if(value > 0 && currentZoom < zoomRange.max || value < 0 && currentZoom > zoomRange.min) {
            this.setState({
                zoom: value + currentZoom
            });
        }
    }

    loadInitialProducts() {
        this.client
            .query({
                query: this.PRODUCTS
            })
            .then(result => {
                this.setState({products: result.data.category.products.items});
            });
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

    render() {
        if(this.state.filters !== null) {
            return (
                <div className={'react-category-container'}>
                    <div className={'filters-block'}>
                        <TopCategories categories={this.props.parameter.topCategories}/>
                        <Filters filters={this.state.filters}
                                 selectedFilters={this.state.selectedFilters}
                                 onFiltersUpdate={this.onFiltersUpdate}
                                 gqlParams={this.props.parameter}
                                 hidden={this.state.dropdown !== "filters"}
                        />
                        <MobileDropdownTogglers onFiltersSubmit={this.onFiltersSubmit}
                                                onFiltersClear={this.onFiltersClear}
                                                onDropdownToggle={this.onDropdownToggle}
                                                dropdownStatus={this.state.dropdown}
                                                userFiltersSelected={this.state.userFiltersSelected}
                                                userFiltersSubmited={this.state.userFiltersSubmited}
                        />
                    </div>
                    <div className={'products-block zoom-' + this.state.zoom}>
                        <SortersZoom onSetSorters={this.onSetSorters}
                                     onSetZoom={this.onSetZoom}
                                     currentSorter={this.state.sort}
                                     hidden={this.state.dropdown !== "sorters"}
                        />
                        <Products products={this.state.products}/>
                    </div>
                </div>
            );
        } else {
            return <div className={'loading'}>{'Loading...'}</div>
        }
    }
}

App.propTypes  = {
    parameter: PropTypes.object.isRequired
};

export default App;
