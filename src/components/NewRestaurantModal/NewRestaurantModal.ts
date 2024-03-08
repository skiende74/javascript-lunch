import { CATEGORIES_KEYS, CONDITIONS } from '@/constants/Condition';
import BasicModal from '../Basic/BasicModal/BasicModal';
import SelectBox from '../Basic/SelectBox/SelectBox';
import BaseComponent from '../BaseComponent';
import BasicButton from '../Basic/BasicButton/BasicButton';
import RestaurantDBService from '@/domains/services/RestaurantDBService';
import { IRestaurant } from '@/types/Restaurant';

import './NewRestaurantModal.css';
class NewRestaurantModal extends BaseComponent {
  #form;
  #title;

  constructor() {
    super();
    this.#form = document.createElement('form');
    this.#title = document.createElement('h2');

    this.#title.classList.add('modal-title', 'text-title');
    this.#title.textContent = '새로운 음식점';
  }

  render() {
    this.#makeForm();

    const $fragment = new DocumentFragment();
    $fragment.append(this.#title);
    $fragment.append(this.#form);
    this.append(new BasicModal($fragment));
  }

  #makeForm() {
    const $categorySelection = this.#makeCategorySelectBox();

    const $nameInputBox = this.#makeNameInputBox();
    const $distanceSelectBox = this.#makeDistanceSelectBox();

    const $descriptionTextBox = this.makeDescriptionTextBox();
    const $linkTextBox = document.createElement('div');
    $linkTextBox.classList.add('form-item');
    $linkTextBox.innerHTML = ` <label for="link text-caption">참고 링크</label>
            <input type="text" name="link" id="link" />
             <span class="help-text text-caption"> 매장 정보를 확인할 수 있는 링크를 입력해 주세요.</span>`;

    const $buttonBox = document.createElement('div');
    $buttonBox.classList.add('button-container');

    const cancelButton = new BasicButton(false, '취소하기', 'reset', () => {
      this.closeModal();
    });
    const addButton = new BasicButton(true, '추가하기', 'submit', () => {
      this.closeModal();
    });

    $buttonBox.append(cancelButton);
    $buttonBox.append(addButton);

    this.#form.append($categorySelection);
    this.#form.append($nameInputBox);
    this.#form.append($distanceSelectBox);
    this.#form.append($descriptionTextBox);
    this.#form.append($linkTextBox);
    this.#form.append($buttonBox);

    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();
      document.querySelector('.category-select > .error')?.classList.add('hidden');
      document.querySelector('.distance-select > .error')?.classList.add('hidden');

      const name = (this.#form.elements.namedItem('name') as HTMLInputElement).value;

      const distance = Number(
        (this.#form.elements.namedItem('distance') as HTMLInputElement).value.slice(0, -3),
      );

      const category = (this.#form.elements.namedItem('category') as HTMLInputElement).value;
      const description = (this.#form.elements.namedItem('description') as HTMLInputElement).value;
      const link = (this.#form.elements.namedItem('link') as HTMLInputElement).value;

      //필수값 validation
      if (category === '선택해주세요') {
        document.querySelector('.category-select > .error')?.classList.remove('hidden');
      }

      if (Number.isNaN(distance)) {
        document.querySelector('.distance-select > .error')?.classList.remove('hidden');
      }

      if (category === '선택해주세요' || Number.isNaN(distance)) {
        return;
      }

      const newRestaurant: IRestaurant = {
        name,
        distance, // TODO : '분 내'를 지우려고 3개없앴음. 야매로 해뒀음.
        category,
      };
      if (description) {
        newRestaurant.description = description;
      }
      if (link) {
        newRestaurant.link = link;
      }
      const DBService = new RestaurantDBService();
      DBService.add(newRestaurant);

      const selectElement = document.querySelector('.restaurant-filter-container');
      const event = new Event('change', {
        bubbles: true,
        cancelable: true,
      });
      selectElement?.dispatchEvent(event);
    });
    this.closeModal();
  }

  private makeDescriptionTextBox() {
    const $descriptionTextBox = document.createElement('div');
    $descriptionTextBox.classList.add('form-item');
    $descriptionTextBox.innerHTML = `
              <label for="description text-caption">설명</label>
              <textarea name="description" id="description" cols="30" rows="5"></textarea>
              <span class="help-text text-caption">메뉴 등 추가 정보를 입력해 주세요.</span>
`;
    return $descriptionTextBox;
  }

  #makeCategorySelectBox() {
    const $categorySelectBox = document.createElement('div');
    $categorySelectBox.classList.add('form-item', 'form-item--required', 'category-select');

    const $categoryLabel = document.createElement('label');
    $categoryLabel.setAttribute('for', 'category text-caption');
    $categoryLabel.textContent = '카테고리';
    $categorySelectBox.append($categoryLabel);

    const CATEGORIES_KEYS_REQUIRED = ['선택해주세요', ...CATEGORIES_KEYS];
    const $categorySelect = new SelectBox(CATEGORIES_KEYS_REQUIRED, 'category');
    $categorySelectBox.append($categorySelect);

    const errorBox = document.createElement('div');
    errorBox.classList.add('error', 'hidden');
    errorBox.textContent = '카테고리는 필수 입력입니다.';
    $categorySelectBox.append(errorBox);

    return $categorySelectBox;
  }

  #makeNameInputBox() {
    const $nameInputBox = document.createElement('div');
    $nameInputBox.classList.add('form-item', 'form-item--required');
    $nameInputBox.innerHTML = `
    <label for="name text-caption">이름</label>
     <input type="text" name="name" id="name" required />
    `;
    return $nameInputBox;
  }

  #makeDistanceSelectBox() {
    const $distanceSelection = document.createElement('div');
    $distanceSelection.classList.add('form-item', 'form-item--required', 'distance-select');
    $distanceSelection.innerHTML = `<label for="distance text-caption">거리(도보 이동 시간) </label>  
      `;

    const DISTANCES_REQURIED = [
      '선택해주세요',
      ...CONDITIONS.DISTANCES.map((num) => `${String(num)}분 내`),
    ];
    $distanceSelection.append(new SelectBox(DISTANCES_REQURIED, 'distance'));
    const errorBox = document.createElement('div');
    errorBox.classList.add('error', 'hidden');
    errorBox.textContent = '거리 값은 필수 입력입니다.';
    $distanceSelection.append(errorBox);

    return $distanceSelection;
  }

  closeModal() {
    document.querySelector('.category-select > .error')?.classList.add('hidden');
    document.querySelector('.distance-select > .error')?.classList.add('hidden');

    this.classList.remove('modal--open');
  }
}
export default NewRestaurantModal;

customElements.define('new-restaurantmodal', NewRestaurantModal);
