import style from './BasicButton.module.css';

class BasicButton extends HTMLButtonElement {
  #isPrimary;

  constructor(
    styleVariant: 'primary' | 'secondary',
    innerText: string,
    type: 'submit' | 'reset' | 'button',
    clickEvent: () => void,
    classNames?: string[],
  ) {
    super();
    styleVariant = styleVariant ?? this.getAttribute('style-variant');
    innerText = innerText ?? this.innerText;
    type = type ?? this.getAttribute('type');
    this.#isPrimary = styleVariant;
    this.innerText = innerText;
    this.setAttribute('type', type);
    this.classList.add(...(classNames ?? ''));

    const buttonStyleClass =
      this.#isPrimary === 'primary'
        ? ['button--primary', `${style.buttonPrimary}`]
        : ['button--secondary', `${style.buttonSecondary}`];

    this.classList.add('button', `${style.button}`, 'text-caption');
    this.classList.add(...buttonStyleClass);

    this.addEventListener('click', () => {
      clickEvent();
    });
  }

  render() {}
}

customElements.define('basic-button', BasicButton, { extends: 'button' });

export default BasicButton;
