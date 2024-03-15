import BaseComponent from '../../BaseComponent';
import './BasicModal.css';
class BasicModal extends HTMLDivElement {
  #backdrop: HTMLDivElement;
  #modalContainer: HTMLDivElement;
  constructor() {
    super();

    this.classList.add('modal');
    const children = Array.from(this.querySelectorAll('.modal > *')!);

    this.#backdrop = document.createElement('div');
    this.#backdrop.classList.add('modal-backdrop');
    this.#backdrop.addEventListener('click', this.closeModal.bind(this));
    this.append(this.#backdrop);

    this.#modalContainer = document.createElement('div');
    this.#modalContainer.classList.add('modal-container');
    this.append(this.#modalContainer);

    this.appendAll(children);
    this.#backdrop.addEventListener('click', () => {
      document.querySelector('.modal')?.classList.remove('modal--open');
    });
  }

  render() {}

  appendAll(children: Node[]) {
    children.forEach((child) => this.#modalContainer.append(child));
  }

  closeModal() {
    this.classList.remove('modal--open');
  }

  openModal() {
    this.classList.add('modal--open');
  }
}
export default BasicModal;

customElements.define('basic-modal', BasicModal, { extends: 'div' });
