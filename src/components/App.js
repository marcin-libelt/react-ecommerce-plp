import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { gql } from 'apollo-boost';
import SortersZoom from "./SortersZoom";
import Products from "./Products";
import Filters from "./Filters";
import TopCategories from "./TopCategories";
import MobileDropdownTogglers from './MobileDropdownTogglers';
import { prepareProductsQuery, prepareFiltersQuery } from '../helpers/queryParameters'
import LoaderMask from "./LoaderMask";

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
            productLoadingComplete: true,
            currentPage: 1,
            isSidebarFixed: false
        };

        this.defaults = {
            zoomRange: {
                min: 0,
                max: 2
            },
            autoLoadOffset: 300,
            chunkSize: 18, // initial products count = page size
            uriHashPrefix: 'categoryFilters!',
            sessionScrollKey: 'plp-scroll'
        };

        this.isLocked = false;
        this.totalPages = 0;
        this.viewportHeigh = 0;
        this.wrapperElement = document.querySelector('.column.main');

        this.client = new ApolloClient({
            uri: this.props.parameter.gql
        });
    }

    componentDidMount() {
        this.getFilters();
        this.filtersFromUri();
        this.initPager();
    }

    initPager() {
        this.viewportHeigh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        document.addEventListener('scroll', this.pagerScrollHandler);
        window.addEventListener('resize', this.viewportResizeHandler);
    }

    pagerScrollHandler = () => {

        if(!this.isLocked && this.totalPages > this.state.currentPage) {
            if (this.viewportHeigh >= this.wrapperElement.getBoundingClientRect().bottom - this.defaults.autoLoadOffset) {
                this.isLocked = true;
                this.setState(prevState => ({
                    currentPage: prevState.currentPage + 1
                }), () => {
                    this.getProducts(true);
                    this.updateUri();
                });
            }
        }

        const result = this.viewportHeigh >= this.wrapperElement.getBoundingClientRect().bottom;
        if(result !== this.state.isSidebarFixed) {
            this.setState({
                isSidebarFixed: !this.state.isSidebarFixed
            })
        }

        sessionStorage.removeItem(this.defaults.sessionScrollKey);
    };

    viewportResizeHandler = () => {
        this.viewportHeigh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
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
                let page = this.state.currentPage;
                let filtersSubmitedFlag = false;
                const recoveredFiltersState = this.decodeFilterUri(str);

                if(recoveredFiltersState['z']) {
                    zoom = parseInt(recoveredFiltersState['z'][0]);
                    delete recoveredFiltersState['z'];
                }

                if(recoveredFiltersState['s']) {
                    sort = recoveredFiltersState['s'][0];
                    delete recoveredFiltersState['s'];
                }

                if(recoveredFiltersState['p']) {
                    page = parseInt(recoveredFiltersState['p'][0]);
                    delete recoveredFiltersState['p'];
                }

                // after page load some filters are available or not
                // if the filters are existed - make CLEAR button visible
                if(Object.keys(recoveredFiltersState).length) {
                    filtersSubmitedFlag = true;
                }

                this.setState({
                    userFiltersSubmited: filtersSubmitedFlag,
                    selectedFilters: recoveredFiltersState,
                    zoom,
                    sort,
                    currentPage: page
                }, () => { this.getProducts(false, true) })
            }
        } else {
            // normal product Load without filters nor sorters
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
        //make APPLY button visible
        let flag;

        if(!this.state.userFiltersSubmited) {
            if(this.isAnyFiltersApplied()) {
                flag = true;
            } else {
                flag = false;
            }
        } else {
            flag = true;
        }

        this.setState({
            userFiltersSelected: flag
        });
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

    onFiltersSubmit() {
        this.scrollToPosition();
        this.setState({
            productLoadingComplete: false
        });
        this.updateUri();
        this.getProducts();
    }

    updateUri() {
        const queryString = this.encodeFilterUri();
        location.hash = this.defaults.uriHashPrefix + (queryString ? queryString + '&': '') + `s=${this.state.sort}&z=${this.state.zoom}&p=${this.state.currentPage}`;
    }

    onFiltersClear() {
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

    getProducts(loadNextPage = false, scrollToPosition = false) {

        let pageSize = this.defaults.chunkSize;
        let currentPage = this.state.currentPage;

        if(!loadNextPage) {
            pageSize = this.defaults.chunkSize * this.state.currentPage;
            currentPage = 1;
        }

        this.client
            .query({
                query: prepareProductsQuery({
                    categoryId: this.props.parameter.categoryId,
                    selectedFilters: this.state.selectedFilters,
                    zoom: this.state.zoom,
                    sort: this.state.sort,
                    pageSize,
                    currentPage
                })
            })
            .then(result => {
                let products = [];
                this.totalPages = result.data["discountFilteredProducts"]["page_info"]["total_pages"];

                if(loadNextPage) { // concat product items
                    const oldProducts = [...this.state.products];
                    products = oldProducts.concat(result.data["discountFilteredProducts"].items);
                } else { // simply load product items ( replace )
                    products = result.data["discountFilteredProducts"].items;
                }

                this.setState({
                    products: products,
                    userFiltersSelected: false,
                    userFiltersSubmited: this.isAnyFiltersApplied()
                }, () => { this.afterGetProducts(scrollToPosition) });
            });
    }

    clickListenerForProducts = event => {
        sessionStorage.setItem(this.defaults.sessionScrollKey, document.documentElement.scrollTop || document.body.scrollTop);
    }

    scrollToPosition() {
        window.scrollTo(0, parseInt(sessionStorage.getItem(this.defaults.sessionScrollKey)) || 0);
    }

    afterGetProducts(scrollTo) {
        this.isLocked = false;

        setTimeout(() => {
            // reset event listener
            if("undefined" != typeof document.querySelectorAll('ul.products')[0]) {
                document.querySelectorAll('ul.products')[0].removeEventListener('click', this.clickListenerForProducts);
                document.querySelectorAll('ul.products')[0].addEventListener('click', this.clickListenerForProducts);

                if(scrollTo) {
                    this.scrollToPosition();
                }
                this.setState({
                    productLoadingComplete: true
                });
            }
        }, 500);
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

        const clsNamesArr = [
            'react-category-container',
            this.state.isSidebarFixed ? 'un-fixed' : ''
        ];

        if(this.state.filters !== null) {
            return (
                <div className={clsNamesArr.join(' ')}>
                    <div className={'filters-block'}>
                        <div className={'inner-container'}>
                            <TopCategories categories={this.props.parameter.topCategories}/>
                            <Filters filters={this.state.filters}
                                     selectedFilters={this.state.selectedFilters}
                                     onFiltersUpdate={this.onFiltersUpdate}
                                     gqlParams={this.props.parameter}
                                     hidden={this.state.dropdown !== "filters"}
                            />
                        </div>
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
                        <Products products={this.state.products} loadingComplete={this.state.productLoadingComplete}/>
                    </div>
                </div>
            );
        } else {
            return <LoaderMask />
        }
    }
}

App.propTypes  = {
    parameter: PropTypes.object.isRequired
};

export default App;
