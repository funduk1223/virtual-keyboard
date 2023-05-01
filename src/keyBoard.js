import KeyButton from './keyButton.js';

export default class KeyBoard {
  constructor(elem, textArea, lang) {
    this.elem = elem;
    this.textArea = textArea;
    this.textAreaFocus = false;
    this.input = '';
    this.keysList = {};
    this.language = lang;
    this.cursor = 0;
    this.isTabPressed = false;
    this.isShiftPressed = false;
    this.isCtrlPressed = false;
    this.isAltPressed = false;
    this.isCapsPressed = false;
    this.hasChangedLanguage = false;
  }

  init(obj) {
    let row = document.createElement('div');
    row.className = 'virtual-keyboard__row';
    this.elem.appendChild(row);
    const objKeys = Object.entries(obj);
    for (let index = 0; index < objKeys.length; index += 1) {
      const element = objKeys[index][1];
      const key = objKeys[index][0];
      const keyButton = new KeyButton(element, this.language);
      const htmlButton = this.createKeyButton(key, keyButton.value);
      this.keysList[key] = keyButton;
      row.appendChild(htmlButton);
      if (key === 'Backspace'
        || key === 'Delete'
        || key === 'Enter'
        || key === 'ShiftRight') {
        row = document.createElement('div');
        row.className = 'virtual-keyboard__row';
        this.elem.appendChild(row);
      }
    }
    this.textArea.onclick = () => {
      this.cursor = this.textArea.selectionEnd;
    };
    return this.keysList;
  }

  createKeyButton(id, value) {
    const htmlButton = document.createElement('button');
    htmlButton.className = 'virtual-keyboard__button';
    htmlButton.id = `${id}`;
    htmlButton.innerText = `${value}`;

    htmlButton.addEventListener('mousedown', () => {
      this.buttonMouseDownHandler(htmlButton);
    });
    htmlButton.addEventListener('mouseup', () => {
      this.buttonMouseUpHandler(htmlButton);
    });

    return htmlButton;
  }

  setActiveState(active, elem) {
    let htmlBtn;
    switch (active) {
      case true:
        htmlBtn = this.elem.querySelector(`#${elem}`);
        htmlBtn.classList.add('virtual-keyboard__button_active');
        break;
      case false:
        htmlBtn = this.elem.querySelector(`#${elem}`);
        htmlBtn.classList.remove('virtual-keyboard__button_active');
        break;

      default:
        throw new Error('can\'t set active state');
    }
  }

  changeLang() {
    const objKeys = Object.entries(this.keysList);
    for (let index = 0; index < objKeys.length; index += 1) {
      let btn;
      const key = objKeys[index][0];
      const keyButton = objKeys[index][1];
      if (keyButton.type !== 'func') {
        btn = document.getElementById(key);
        btn.innerText = '';
        keyButton.toggleLanguage(this.language);
        btn.innerText = `${keyButton.returnValue()}`;
      }
    }
    this.language = (this.language === 'en' ? 'ru' : 'en');
    localStorage.setItem('lang', this.language);
  }

  shiftButtons() {
    const objKeys = Object.entries(this.keysList);
    for (let index = 0; index < objKeys.length; index += 1) {
      let btn;
      const key = objKeys[index][0];
      const keyButton = objKeys[index][1];
      keyButton.toggleValue();
      if (keyButton.type !== 'func') {
        btn = document.getElementById(key);
        btn.innerText = '';
        btn.innerText = `${keyButton.returnValue()}`;
      }
    }
  }

  capsButtons() {
    const objKeys = Object.entries(this.keysList);
    for (let index = 0; index < objKeys.length; index += 1) {
      let btn;
      const keyButton = objKeys[index][1];
      const key = objKeys[index][0];
      const result = keyButton.returnValue().match(/[a-zа-яё]/ig);
      if (this.keysList[key].type === 'char' && result) {
        keyButton.toggleValue();
        btn = document.getElementById(key);
        btn.innerText = '';
        btn.innerText = `${keyButton.returnValue()}`;
      }
    }
  }

  buttonMouseUpHandler(htmlButton) {
    if (`${htmlButton.id}` in this.keysList) {
      this.buttonKeyUpHandler(htmlButton.id);
      htmlButton.removeEventListener('mouseleave', () => {
        this.buttonMouseUpHandler(htmlButton);
      });
    }
  }

  buttonMouseDownHandler(htmlButton) {
    if (`${htmlButton.id}` in this.keysList) {
      this.buttonPressDownHandler(htmlButton.id);
      htmlButton.addEventListener('mouseleave', () => {
        this.buttonMouseUpHandler(htmlButton);
      });
    }
  }

  buttonKeyUpHandler(keyButton) {
    this.buttonPressUpHandler(keyButton);
  }

  buttonKeyDownHandler(keyButton) {
    this.buttonPressDownHandler(keyButton);
  }

  buttonPressDownHandler(btn) {
    this.textArea.focus();
    if (`${btn}` in this.keysList) { // Functionality key
      let btnType = this.keysList[btn].type;
      if (btnType === 'func') {
        if (!this.isShiftPressed && (btn === 'ShiftLeft' || btn === 'ShiftRight')) {
          this.isShiftPressed = true;
          this.setActiveState(this.isShiftPressed, btn);
          this.shiftButtons();
        } else if (!this.isCtrlPressed && (btn === 'ControlLeft' || btn === 'ControlRight')) {
          this.isCtrlPressed = true;
          this.setActiveState(this.isCtrlPressed, btn);
        } else if (!this.isAltPressed && (btn === 'AltRight' || btn === 'AltLeft')) {
          this.isAltPressed = true;
          this.setActiveState(this.isAltPressed, btn);
        } else if (btn === 'CapsLock') {
          this.isCapsPressed = !this.isCapsPressed;
          this.capsButtons();
          this.setActiveState(this.isCapsPressed, btn);
        } else if (!this.isTabPressed && btn === 'Tab') {
          this.isTabPressed = true;
          this.setActiveState(this.isTabPressed, btn);
          this.addChar(this.keysList[btn].value);
        } else if (btn === 'Backspace') {
          this.setActiveState(true, btn);
          this.deleteChar(-1);
        } else if (btn === 'Delete') {
          this.setActiveState(true, btn);
          this.deleteChar(0);
        }
      } else if (btnType !== 'func'
              && btnType !== 'lang') { // Default key:
        this.setActiveState(true, btn);
        this.addChar(this.keysList[btn].value);
        console.log(this.input);
      } else if (this.keysList[btn].type === 'lang') {
        this.changeLang();
      }

      if (this.isShiftPressed && this.isAltPressed && !this.hasChangedLanguage) {
        this.hasChangedLanguage = true;
        this.changeLang();
      }
    }
  }

  addChar(char) {
    const outputCharArr = this.input.split('');
    outputCharArr.splice(this.cursor, 0, char);
    this.input = outputCharArr.join('');
    setTimeout(() => {
      this.cursor += 1;
      this.textArea.value = this.input;
    }, 10);
  }

  deleteChar(index) {
    if (this.cursor > 0 && this.cursor <= this.input.length) {
      const outputCharArr = this.input.split('');
      outputCharArr.splice(this.cursor + index, 1);
      this.input = outputCharArr.join('');
      setTimeout(() => {
        this.cursor += index;
        this.textArea.value = this.input;
      }, 10);
    }
  }

  buttonPressUpHandler(btn) {
    if (`${btn}` in this.keysList) {
      if (this.isShiftPressed && this.isAltPressed && this.hasChangedLanguage) {
        this.hasChangedLanguage = false;
      }
      if (this.isShiftPressed && (btn === 'ShiftLeft' || btn === 'ShiftRight')) {
        this.isShiftPressed = false;
        this.shiftButtons(this.isShiftPressed);
        this.setActiveState(this.isShiftPressed, btn);
      } else if (this.isCtrlPressed && (btn === 'ControlLeft' || btn === 'ControlRight')) {
        this.isCtrlPressed = false;
        this.setActiveState(this.isCtrlPressed, btn);
      } else if (this.isAltPressed && (btn === 'AltRight' || btn === 'AltLeft')) {
        this.isAltPressed = false;
        this.setActiveState(this.isAltPressed, btn);
      } else if (this.isTabPressed && btn === 'Tab') {
        this.isTabPressed = false;
        this.setActiveState(this.isTabPressed, btn);
      } else if (btn !== 'CapsLock') {
        this.setActiveState(false, btn);
      }
    }
  }
}
