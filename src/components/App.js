import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { gql } from 'apollo-boost';
import SortersZoom from "./SortersZoom";
import Products from "./Products";
import Filters from "./Filters";
import TopCategories from "./TopCategories";
import FiltersActions from "./FiltersActions";

const zoomRange = {
    min: 0,
    max: 2
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.onFiltersUpdate = this.onFiltersUpdate.bind(this);
        this.onFiltersClear = this.onFiltersClear.bind(this);
        this.onSetSorters = this.onSetSorters.bind(this);
        this.onSetZoom = this.onSetZoom.bind(this);

        this.state = {
            products: [],
            selectedFilters: {},
            sort: 'relevance',
            zoom: 1
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
    }

    componentDidMount() {
        this.loadInitialProducts();
        this.filtersFromUri();
    }

    onSetSorters(sort) {
        this.setState({sort: sort});
    }

    handleClick() {
        console.log('button click!')
    }

    filtersFromUri() {
        if(location.search) {
            console.log(this.decodeFilterUri(location.search));
        }
    }

    onFiltersUpdate(value, filterVarName) {

        // exception for Price filter
        if(filterVarName === "price") {
            const minMax = [value.min, value.max];
            this.setState(prevState => ({
                selectedFilters: { ...prevState.selectedFilters, "price": minMax }
            }));
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
                } else {
                    // add
                    selectedFilters = [...this.state.selectedFilters[filterVarName], value];
                }

                this.setState(prevState => ({
                    selectedFilters: {
                        ...prevState.selectedFilters,
                        [filterVarName]: selectedFilters
                    }
                }), this.afterFiltersAction);
            }
        }
    }

    /** update URL
    // update state
    // get filtered products
    */
    afterFiltersAction() {
        const queryString = this.encodeFilterUri();


        //const decoded = this.decodeFilterUri(queryString);
    }

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
        alert('submited!');
    }

    onFiltersClear() {
        this.setState({
            selectedFilters: {}
        })
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

    render() {
        console.log('App.js render')
        return (
            <div className={'react-category-container'} >
                <div className={'filters-block'}>
                    <TopCategories categories={this.props.parameter.topCategories}/>
                    <Filters selectedFilters={this.state.selectedFilters}
                             onFiltersUpdate={this.onFiltersUpdate}
                             gqlParams={this.props.parameter}/>
                    <FiltersActions onFiltersSubmit={this.onFiltersSubmit}
                                    onFiltersClear={this.onFiltersClear}/>
                </div>
                <div className={'products-block zoom-' + this.state.zoom}>
                    <SortersZoom onSetSorters={this.onSetSorters}
                                 onSetZoom={this.onSetZoom}
                                 currentSorter={this.state.sort}
                    />
                    <Products products={this.state.products}/>
                </div>
            </div>
        );
    }
}

App.propTypes  = {
    parameter: PropTypes.object.isRequired
};

export default App;
