// TODO: create a vertual keyboard also from scripts
const virtualKeyboard = document.querySelector('.visual-keyboard');

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
        result = this.key.ru == undefined ? this.key.en : this.key.ru;
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
      for (const lang in this.key) {
        const buffer = this.key[lang].value;
        this.key[lang].value = this.key[lang].shiftValue;
        this.key[lang].shiftValue = buffer;
      }
    }
    this.mainLang = this.setButtonLang();
    this.setButtonValue();
    return this;
  }

  toggleLanguage() {
    switch (this.lang) {
      case 'en':
        this.mainLang = this.key.ru == undefined ? this.key.en : this.key.ru;
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
  constructor(elem) {
    this.elem = elem;
    // elem.onclick = this.onClick.bind(this);
    this.keysList = {};
    this.language = 'en';
    this.isShiftPressed = false;
    this.isCtrlPressed = false;
    this.isAltPressed = false;
    this.isCapsPressed = false;
  }

  onClick(event) {
    const element = event.target;
    if (element.nodeName === 'BUTTON') {
      console.log(`this.elem = ${this.elem} menu class = ${element.id}`);
    }
  }

  init(obj) {
    for (const key in obj) {
      // TODO: check local storage and get lang value; try catch and set default;
      const lang = 'en';
      const element = obj[key];
      const keyButton = new KeyButton(element, lang);
      const htmlButton = this.createKeyButton(key, keyButton.value);
      this.keysList[key] = keyButton;
      this.elem.appendChild(htmlButton);
    }

    return this.keysList;
  }

  createKeyButton(id, value) {
    const htmlButton = document.createElement('button');
    htmlButton.className = 'key-button';
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
        htmlBtn.classList.add('key-button-active');
        break;
      case false:
        htmlBtn = this.elem.querySelector(`#${elem}`);
        htmlBtn.classList.remove('key-button-active');
        break;

      default:
        throw new Error('can\'t set active state');
    }
  }

  changeLang() {
    for (const k in this.keysList) {
      let btn;
      const keyButton = this.keysList[k];
      if (keyButton.type !== 'func') {
        btn = document.getElementById(k);
        btn.innerText = '';
        keyButton.toggleLanguage(this.language);
        btn.innerText = `${keyButton.returnValue()}`;
      }
    }
    this.language = (this.language === 'en' ? 'ru' : 'en');
  }

  shiftButtons() {
    for (const k in this.keysList) {
      let btn;
      const keyButton = this.keysList[k];
      keyButton.toggleValue();
      if (keyButton.type !== 'func') {
        btn = document.getElementById(k);
        btn.innerText = '';
        btn.innerText = `${keyButton.returnValue()}`;
      }
    }
  }

  capsButtons() {
    for (const k in this.keysList) {
      let btn;
      const keyButton = this.keysList[k];

      if (this.keysList[k].type === 'char') {
        keyButton.toggleValue();
        btn = document.getElementById(k);
        btn.innerText = '';
        btn.innerText = `${keyButton.returnValue()}`;
      }
    }
  }

  buttonMouseUpHandler(htmlButton) {
    if (`${htmlButton.id}` in this.keysList) {
      const entiresBtn = this.keysList[htmlButton.id];
      // console.log(`type = ${entiresBtn.type} html value = '${htmlButton.innerText}' btn value = '${entiresBtn.value}' code button = ${entiresBtn.code}`);
      this.buttonKeyUpHandler(entiresBtn.code);
    }
  }

  buttonMouseDownHandler(htmlButton) {
    if (`${htmlButton.id}` in this.keysList) {
      const entiresBtn = this.keysList[htmlButton.id];
      console.log(`type = ${entiresBtn.type} html value = '${htmlButton.innerText}' btn value = '${entiresBtn.value}' code button = ${entiresBtn.code}`);
      this.buttonPressDownHandler(entiresBtn.code);
    }
  }

  buttonKeyUpHandler(keyButton) {
    this.buttonPressUpHandler(keyButton);
  }

  buttonKeyDownHandler(keyButton) {
    this.buttonPressDownHandler(keyButton);
  }

  buttonPressDownHandler(btn) {
    if (`${btn}` in this.keysList) {
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
        console.log(`CAPS has pressed! ${btn}`);

        this.isCapsPressed = !this.isCapsPressed;
        this.capsButtons();
        this.setActiveState(this.isCapsPressed, btn);
      }
      // Default:
      else {
        this.setActiveState(true, btn);
      }

      if (this.isCtrlPressed && this.isAltPressed) {
        console.log(`change lang! ${btn}`);
        this.changeLang();
      }
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
      } else if (btn !== 'CapsLock') {
        this.setActiveState(false, btn);
      }
    }
  }
}

let keyBoard;
let KEYS;
fetch('/keys.json')
  .then((response) => response.json())
  .then((responseJSON) => {
    KEYS = responseJSON;
    keyBoard = new KeyBoard(virtualKeyboard);
    keyBoard.init(KEYS);
  });

// Phisycal Keyboard handler to special buttons

document.addEventListener('keydown', (event) => {
  const { code } = event;
  keyBoard.buttonKeyDownHandler(code);
  console.log(`!! pressed btn = ${code}`);
});

document.addEventListener('keyup', (event) => {
  const { code } = event;
  keyBoard.buttonKeyUpHandler(code);
});
