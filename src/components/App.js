import React from 'react';
import ApolloClient, { gql } from 'apollo-boost';
import SortersZoom from "./SortersZoom";
import Products from "./Products";
import Filters from "./Filters";
import TopCategories from "./TopCategories";
import FiltersActions from "./FiltersActions";
import { createBrowserHistory } from 'history';

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
            priceFilter: {},
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

        this.history = createBrowserHistory();
        this.history.listen((location, action) => {
            if(action == "POP") {
                this.setState({
                    selectedFilters: location.state.filters
                });
            }
            console.log(action, location.pathname, location.state);
        });

    }

    componentDidMount() {
        this.loadInitialProducts();
    }

    onSetSorters(sort) {
        this.setState({sort: sort});
    }

    handleClick() {
        console.log('button click!')
    }

    onFiltersUpdate(value, filterVarName) {

        // exception for Price filter
        if(filterVarName === "price") {

            this.setState(prevState => ({
                priceFilter: value
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
                });

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
                }))
            }
        }
        this.afterFiltersAction();
    }

    /** update URL
    // update state
    // get filtered products
    */
    afterFiltersAction() {
        this.history.push('/home', { filters: this.state.selectedFilters });
    }

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

export default App;
