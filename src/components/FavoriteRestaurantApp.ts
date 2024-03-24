import { Category, IRestaurant, SortCriteria } from '@/types/Restaurant';
import { dom } from '@/util/dom';
import restaurantListMock from '@/mock/restaurantList.mock';
import FilterContainer from './Basic/FilterContainer';
import RestaurantDBService from '@/domains/services/RestaurantDBService';
import RestaurantList from './RestaurantList/RestaurantList';

import '@/css/index.css';

class FavoriteRestaurantApp extends HTMLDivElement {
  $filterContainer: FilterContainer;
  $restaurantList: RestaurantList;
  #restaurantDBService: RestaurantDBService;

  observedAttributes = [];

  constructor() {
    super();
    this.classList.add('favorite-restaurant-app');
    this.innerHTML = `
    <div is="filter-container" class="restaurant-filter-container"></div>
    <ul is="restaurant-list" class="restaurant-list-container restaurant-list"></ul>
    `;

    this.$filterContainer = dom.getElement(this, '.restaurant-filter-container');
    this.$filterContainer.addEventListener('change', this.#onChangeFilterContainer.bind(this));
    this.$restaurantList = dom.getElement(this, '.restaurant-list');
    this.#restaurantDBService = new RestaurantDBService();
    this.render();
  }
  render() {
    this.$restaurantList.paint(this.#getNewRestaurantList());
  }

  #getNewRestaurantList() {
    const { category, sortCriteria } = this.$filterContainer.get();

    let newRestaurantList = this.#getDB(category as Category, sortCriteria as SortCriteria);
    if (newRestaurantList.length === 0) {
      this.#setMock();
      newRestaurantList = this.#getDB(category as Category, sortCriteria as SortCriteria);
    }
    return newRestaurantList.filter((restaurant: IRestaurant) => restaurant.isFavorite);
  }

  #setMock() {
    this.#restaurantDBService.set(restaurantListMock);
  }

  #getDB(category: Category, sortCriteria: SortCriteria) {
    return this.#restaurantDBService.getAfterFiltering(category, sortCriteria);
  }

  #onChangeFilterContainer() {
    this.render();
  }
}

customElements.define('favorite-restaurant-app', FavoriteRestaurantApp, { extends: 'div' });

export default FavoriteRestaurantApp;
