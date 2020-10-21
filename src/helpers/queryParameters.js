import ApolloClient, { gql } from 'apollo-boost';

export const prepareProductsQuery = (params) => {

    const { selectedFilters, categoryId, sort, pageSize, currentPage } = params;
    let cumulativeArr = [];
    let sorter = "";
    if(selectedFilters) {
        Object.keys(selectedFilters).map((item, index) => {
            if (item === "price") {
                cumulativeArr.push(`
                {
                    attribute: "${item}",
                    filter: {
                        from: "${selectedFilters[item][0]}"
                        to: "${selectedFilters[item][1]}"
                    }
                }
            `);
            } else {
                cumulativeArr.push(`
                {
                    attribute: "${item}",
                    filter: {
                        in: ["${selectedFilters[item].join('","')}"]
                    }
                }
            `);
            }
        });
    }

    switch (sort) {
        case "created_at":
            sorter = `${sort}: DESC`;
            break;
        case "position":
            sorter = `${sort}: ASC`;
            break;
        case "low":
        case "high":
            if(sort === "low") {
                sorter = `price: ASC`;
            } else {
                sorter = `price: DESC`;
            }
            break;
    }

    return gql`
        {
          discountFilteredProducts(
            category_id: ${categoryId}
            pageSize: ${pageSize}
            currentPage: ${currentPage}
            sort: {
              ${sorter}
            }
            catalogFilters: [
              ${cumulativeArr.join('\n')}
            ]
          )
          {
            total_count
            items {
              name
              sku
              category_image
              description {
                html
              }
              url_key
              url_suffix
              price {
                regularPrice {
                  amount {
                    value
                    currency
                  }
                }
                minimalPrice {
                  amount {
                    value
                    currency
                  }
                }
              }
              small_image {
                 label
              }
            }
            page_info {
              page_size
              current_page
              total_pages
            }
          }
          currency {
                base_currency_symbol
                base_currency_code
          }
        }
        `;
};


export const prepareFiltersQuery = (params) => {
    return gql`
        {
        discountCatalogFilters(category_id: ${params.categoryId}) {
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
};
