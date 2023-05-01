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
  constructor(elem, textArea) {
    this.elem = elem;
    this.textArea = textArea;
    this.textAreaFocus = false;
    this.input = '';
    this.keysList = {};
    this.language = 'en';
    this.cursor = 0;
    this.isShiftPressed = false;
    this.isCtrlPressed = false;
    this.isAltPressed = false;
    this.isCapsPressed = false;
  }

  init(obj) {
    let row = document.createElement('div');
    row.className = 'visual-keyboard__row';
    this.elem.appendChild(row);
    for (const key in obj) {
      // TODO: check local storage and get lang value; try catch and set default;
      const lang = 'en';
      const element = obj[key];
      const keyButton = new KeyButton(element, lang);
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
    console.log(this.keysList);
    // this.textArea.addEventListener("focusin", () => {
    //   this.textAreaFocus = true;
    //   console.log(`textAreaFocus = ${this.textAreaFocus }`);
    //   setTimeout(()=>{
    //     this.cursor = this.textArea.selectionEnd;
    //     console.log(`this.cursor = ${this.cursor }`);
    //   }, 100);
    //   //if (this.textArea.selectionStart === this.textArea.selectionEnd) this.cursor = this.textArea.selectionEnd;
    // });

    // this.textArea.addEventListener("focusout", () => {
    //   this.textAreaFocus = false;
    //   console.log(`textAreaFocus = ${this.textAreaFocus }`);
    //   console.log(`text area NOT focused this.textArea.selectionEnd = ${this.textArea.selectionEnd}`);
    //   this.cursor = this.textArea.selectionEnd;
    //   //if (this.textArea.selectionStart === this.textArea.selectionEnd) this.cursor = this.textArea.selectionEnd;
    // });
    this.textArea.onclick = () => {
      console.log(`textArea onclick = ${this.textArea.selectionEnd}`);
      this.cursor = this.textArea.selectionEnd;
      // setTimeout(()=>{
        
      //   console.log(`this.cursor = ${this.cursor }`);
      // }, 100);
    }
    //this.textArea.addEventListener("blur", () => form.classList.remove('focused'), true);

    
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
      // let reg = new RegExp(/[a-zа-я]/ig);
      const keyButton = this.keysList[k];
      const result = keyButton.returnValue().match(/[a-zа-яё]/ig);
      if (this.keysList[k].type === 'char' && result) {
        keyButton.toggleValue();
        btn = document.getElementById(k);
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
      const entiresBtn = this.keysList[htmlButton.id];
      //console.log(`type = ${entiresBtn.type} html value = '${htmlButton.innerText}' btn value = '${entiresBtn.value}' code button = ${htmlButton.id}`);
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
        } else if (btn === 'Tab') {
          this.input += '  ';
          this.textArea.textContent = this.input;
          this.setActiveState(true, btn);
        } else if (btn === 'Backspace') {
          this.setActiveState(true, btn);
        }
      } else if (this.keysList[btn].type !== 'func') { // Default key:
        this.setActiveState(true, btn);
        //this.getCursorPosition();
        // this.textArea.focus();
        let outputCharArr;
        outputCharArr = this.input.split('');
        outputCharArr.splice(this.cursor, 0, this.keysList[btn].value)
        this.input = outputCharArr.join('');
        
        //this.input += this.keysList[btn].value;
        setTimeout(()=>{
          this.cursor++;
          this.textArea.value = this.input;
        }, 10);
        
        //console.log(this.input);
      }

      if (this.isCtrlPressed && this.isAltPressed) {
        //console.log(`change lang! ${btn}`);
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
// TODO: create a vertual keyboard also from scripts
const virtualKeyboard = document.querySelector('.visual-keyboard');
const textArea = document.querySelector('.textarea');
let keyBoard;
let KEYS;
fetch('/keys.json')
  .then((response) => response.json())
  .then((responseJSON) => {
    KEYS = responseJSON;
    keyBoard = new KeyBoard(virtualKeyboard, textArea);
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
  //console.log(`!! pressed btn = ${code}`);
});

document.addEventListener('keyup', (event) => {
  const { code } = event;
  keyBoard.buttonKeyUpHandler(code);
});

// textArea.onblur = function() {
//   textArea.focus();
// }
