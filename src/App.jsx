/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categ => categ.id === product.categoryId,
  );
  const user = usersFromServer.find(u => u.id === category.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [activeUserId, setActiveUserId] = useState('All');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState([]);

  const resetAllFilter = () => {
    setQuery('');
    setActiveUserId('All');
    setActiveCategory([]);
  };

  const OWNER_FILTER = ['All', 'Roma', 'Anna', 'Max', 'John'];
  const CATEGORY_FILTER = [
    'Grocery',
    'Drinks',
    'Fruits',
    'Electronics',
    'Clothes',
  ];

  let visibleProducts = [...products];

  if (activeUserId !== 'All') {
    visibleProducts = visibleProducts.filter(
      person => person.user.name === activeUserId,
    );
  }

  if (query) {
    const queryLower = query.toLowerCase();

    visibleProducts = visibleProducts.filter(person =>
      person.name.toLowerCase().includes(queryLower),
    );
  }

  if (activeCategory.length > 0) {
    visibleProducts = visibleProducts.filter(person =>
      activeCategory.includes(person.category.title),
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              {OWNER_FILTER.map(user => (
                <a
                  key={user}
                  data-cy={user === 'All' ? 'FilterAllUsers' : 'FilterUser'}
                  href="#/"
                  className={cn({ 'is-active': user === activeUserId })}
                  onClick={() => setActiveUserId(user)}
                >
                  {user}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': activeCategory.length !== 0,
                })}
                onClick={() => setActiveCategory([])}
              >
                All
              </a>

              {CATEGORY_FILTER.map(category =>
                activeCategory.includes(category) ? (
                  <a
                    key={category}
                    data-cy="Category"
                    href="#/"
                    onClick={() =>
                      setActiveCategory(currentCategory =>
                        currentCategory.filter(element => element !== category),
                      )
                    }
                    className="button mr-2 my-1 is-info"
                  >
                    {category}
                  </a>
                ) : (
                  <a
                    key={category}
                    data-cy="Category"
                    href="#/"
                    onClick={() =>
                      setActiveCategory(currentCategory => [
                        ...currentCategory,
                        category,
                      ])
                    }
                    className="button mr-2 my-1"
                  >
                    {category}
                  </a>
                ),
              )}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilter}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product">
                    <td
                      className="has-text-weight-bold"
                      data-cy="ProductId"
                      key={product.id}
                    >
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn(
                        { 'has-text-link': product.user.sex === 'm' },
                        { 'has-text-danger': product.user.sex === 'f' },
                      )}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
