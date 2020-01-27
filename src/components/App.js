import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { gql } from 'apollo-boost';
import SortersZoom from "./SortersZoom";
import Products from "./Products";
import Filters from "./Filters";
import TopCategories from "./TopCategories";
import MobileDropdownTogglers from './MobileDropdownTogglers';
import { prepareProductsQuery, prepareFiltersQuery } from '../helpers/queryParameters'

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
            selectedFilters: {
            },
            sort: 'position',
            zoom: 1,
            dropdown: null,
            userFiltersSelected: false,
            userFiltersSubmited: false,
        };

        this.defaults = {
            zoomRange: {
                min: 0,
                max: 2
            },
            uriHashPrefix: 'categoryFilters!'
        };

        this.client = new ApolloClient({
            uri: this.props.parameter.gql
        });
    }

    componentDidMount() {
        this.getFilters();
        this.filtersFromUri();
    }

    onSetSorters(sort) {
        this.setState({sort: sort}, () => {
            this.onFiltersSubmit();
        });
    }

    // TODO: consider to change name if this method to something like "get products"
    filtersFromUri() {
        const regex = RegExp(this.defaults.uriHashPrefix);
        if(regex.test(location.hash)) {
            let str = location.hash.replace(regex, '');
            str = str.replace('#', '');
            if(str.length > 0) {
                let zoom = this.state.zoom;
                let sort = this.state.sort;

                const recoveredFiltersState = this.decodeFilterUri(str);

                if(recoveredFiltersState['z']) {
                    zoom = parseInt(recoveredFiltersState['z'][0]);
                    delete recoveredFiltersState['z'];
                }

                if(recoveredFiltersState['s']) {
                    sort = recoveredFiltersState['s'][0];
                    delete recoveredFiltersState['s'];
                }

                this.setState({
                    selectedFilters: recoveredFiltersState,
                    zoom,
                    sort
                }, () => { this.getProducts() })
            }
        } else {
            this.getProducts();
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
        const queryString = this.encodeFilterUri();
        location.hash = this.defaults.uriHashPrefix + (queryString ? queryString + '&': '') + `s=${this.state.sort}&z=${this.state.zoom}`;
        this.getProducts();
    }

    onFiltersClear() {
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
        if(value > 0 && currentZoom < this.defaults.zoomRange.max || value < 0 && currentZoom > this.defaults.zoomRange.min) {
            this.setState({
                zoom: value + currentZoom
            }, () => { this.onFiltersSubmit()});
        }
    }

    getProducts() {
        this.client
            .query({
                query: prepareProductsQuery({
                    categoryId: this.props.parameter.categoryId,
                    selectedFilters: this.state.selectedFilters,
                    zoom: this.state.zoom,
                    sort: this.state.sort
                })
            })
            .then(result => {
                this.setState({products: result.data["discountFilteredProducts"].items});
            });
    }

    getFilters() {
        this.client
            .query({
                query: prepareFiltersQuery({
                    categoryId: this.props.parameter.categoryId
                })
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
