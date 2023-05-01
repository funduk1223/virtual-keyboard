class KeyButton {
  constructor(obj, lang) {
    this.type = obj.type;
    this.lang = lang;
    this.key = obj.element;
    this.mainLang = this.setButtonLang();
    if (this.type !== 'func') {
      this.setButtonValue();
    } else {
      this.value = this.key.en.value;
      this.code = obj.code;
    }
  }

  setButtonLang() {
    let result;
    switch (this.lang) {
      case 'en':
        result = this.key.en;
        break;
      case 'ru':
        result = this.key.ru === undefined ? this.key.en : this.key.ru;
        break;
      default:
        throw new Error('Can\'t recognize the language');
    }
    return result;
  }

  setButtonValue() {
    this.value = this.mainLang.value;
    this.shiftValue = this.mainLang.shiftValue;
  }

  toggleValue() {
    if (this.type !== 'func') {
      const keyLang = Object.entries(this.key);
      for (let index = 0; index < keyLang.length; index += 1) {
        const key = keyLang[index][1];
        const buffer = key.value;
        key.value = key.shiftValue;
        key.shiftValue = buffer;
      }
    }
    this.mainLang = this.setButtonLang();
    this.setButtonValue();
    return this;
  }

  toggleLanguage() {
    switch (this.lang) {
      case 'en':
        this.mainLang = this.key.ru === undefined ? this.key.en : this.key.ru;
        this.lang = 'ru';
        break;
      case 'ru':
        this.mainLang = this.key.en;
        this.lang = 'en';
        break;
      default:
        throw new Error('Can\'t recognize the language');
    }
    this.setButtonValue();
    return this;
  }

  returnValue() {
    return this.value;
  }
}

class KeyBoard {
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
  }

  init(obj) {
    let row = document.createElement('div');
    row.className = 'visual-keyboard__row';
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
        row.className = 'visual-keyboard__row';
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
    htmlButton.className = 'visual-keyboard__button';
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
        htmlBtn.classList.add('visual-keyboard__button_active');
        break;
      case false:
        htmlBtn = this.elem.querySelector(`#${elem}`);
        htmlBtn.classList.remove('visual-keyboard__button_active');
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
      if (this.keysList[btn].type === 'func') {
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
      } else if (this.keysList[btn].type !== 'func') { // Default key:
        this.setActiveState(true, btn);
        this.addChar(this.keysList[btn].value);
        console.log(this.input);
      }

      if (this.isCtrlPressed && this.isAltPressed) {
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
// TODO: create a vertual keyboard also from scripts
const virtualKeyboard = document.querySelector('.visual-keyboard');
const textArea = document.querySelector('.textarea');
let keyBoard;
let KEYS;
let language;
fetch('/keys.json')
  .then((response) => response.json())
  .then((responseJSON) => {
    KEYS = responseJSON;
    language = localStorage.getItem('lang');
    language = language === null ? 'en' : language;
    keyBoard = new KeyBoard(virtualKeyboard, textArea, language);
    keyBoard.init(KEYS);
  });

// Phisycal Keyboard handler to special buttons
document.addEventListener('keydown', (event) => {
  const { code } = event;
  if (code === 'Tab'
  || code === 'Backspace'
  || code === 'AltRight'
  || code === 'AltLeft'
  || code === 'ArrowRight'
  || code === 'ArrowLeft'
  || code === 'ArrowDown'
  || code === 'ArrowUp') {
    event.preventDefault();
  }
  keyBoard.buttonKeyDownHandler(code);
  // console.log(`!! pressed btn = ${code}`);
});

document.addEventListener('keyup', (event) => {
  const { code } = event;
  keyBoard.buttonKeyUpHandler(code);
});

// textArea.onblur = function() {
//   textArea.focus();
// }
