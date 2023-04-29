let btnKeyboard1 = document.querySelector("#button1");
let btnKeyboard2 = document.querySelector("#button2");
let btnKeyboard3 = document.querySelector("#button3");

let virtualKeyboard = document.querySelector('.visual-keyboard');

// const keyLayout = [
//   ["`", "ё"], ["1", "!"],  ["2", '"'],  ["3", "#"],  ["4", "$"],  ["5", "%"],  ["6", "^"],  ["7", "&"],  ["8", "*"],  ["9", "("],  ["0", ")"],  ["backspace"],
//   ["tab"],  ["q", "й"], ["w", "ц"], ["e", "у"], ["r", "к"], ["t", "е"], ["y", "н"], ["u", "г"], ["i", "ш"], ["o", "щ"], ["p", "з"], ["[", "х"], ["]", "ъ"],
//   ["caps"],  ["a", "ф"], ["s", "ы"], ["d", "в"], ["f", "а"], ["g", "п"], ["h", "р"], ["j", "о"], ["k", "л"], ["l", "д"], [";", "ж"], ["'", "э"], ["enter"],
//   ["shift"],  ["z", "я"], ["x", "ч"], ["c", "с"], ["v", "м"], ["b", "и"], ["n", "т"], ["m", "ь"], [",", "б"], [".", "ю"], ["?", "."], ["up"], ["shift"],
//   ["space"],  ["left"], ["down"], ["right"], ["ctrl"]
// ];



class KeyButton {

    constructor(type, en, ru, lang) {
      this.type = type;
      this.en = en;
      this.ru = ru;
      this.value = this.setBtnValue(lang).value;
      this.shiftValue = this.setBtnValue(lang).shiftValue;
    }

    setBtnValue(lang) {
      let result;
      switch (lang) {
        case 'en':
          result = this.en;
          break;
        case 'ru':
          result = this.ru;
          break;
        default:
          throw new Error(`Can't recognize the language`);
          break;
      }
      return result;
    }

    getSymbValue(){
      return this.value;
    }
}


class KeyBoard {

  constructor(elem) {
    this.elem = elem;
    //elem.onclick = this.onClick.bind(this);
    this.keysList = {};
    this.language = 'en';
  }

  onClick(event){
    let element = event.target;
    if (element.nodeName === "BUTTON") {
      console.log(`this.elem = ${this.elem} menu class = ${element.id}`);
    }
  }

 
  init(obj) {
    for (let key in obj) {
      //TODO: check local storage and get lang value; try catch and set default;
      let lang = 'en';
      let enSet = obj[key].element.en;
      let ruSet = obj[key].element.ru == undefined ? obj[key].element.en : obj[key].element.ru;
      let type = obj[key].type;
      let keyButton = new KeyButton(type, enSet, ruSet, lang);
      const htmlButton = this.createKeyButton(key, keyButton.value);
      this.keysList[key] = keyButton;
      this.elem.appendChild(htmlButton);
    }

    return this.keysList;
  }

  createKeyButton(id, value) {
    let htmlButton = document.createElement("button");
    htmlButton.className = "key-button";
    htmlButton.id = `${id}`;
    htmlButton.innerText = `${value}`;
    htmlButton.addEventListener('click', () => {
      this.buttonHandler(htmlButton)
    });
    return htmlButton;
  }
  
  changeLang() {
    for (let k in this.keysList) {
      let btn;
      switch (this.language) {
        case 'en':
          btn = document.getElementById(k);
          btn.innerText = ``;
          try {   btn.innerText = `${this.keysList[k].ru.value}` } 
          catch { btn.innerText = `${this.keysList[k].en.value}` }
          break;

        case 'ru':
          btn = document.getElementById(k);
          btn.innerText = ``;
          try {   btn.innerText = `${this.keysList[k].en.value}` }
          catch { btn.innerText = `${this.keysList[k].en.value}` }
        default:
          break;
      }
    }
    this.language = this.language === 'en' ? 'ru' : 'en';
  }

  
  buttonHandler(htmlButton){
    if (`${htmlButton.id}` in this.keysList) {
      console.log(`type = ${this.keysList[htmlButton.id].type} value = '${htmlButton.innerText}'`);
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
    console.log(JSON.stringify(keyBoard.init(KEYS), ' ', 4));
  });



// Phisycal Keyboard handler to special buttons
let isShiftPressed = false;
let isCtrlPressed = false;
let isAltPressed = false;

document.addEventListener('keydown', function(event) { 
  let code = event.code;
  if (!isShiftPressed && (code === "ShiftLeft" || code === "ShiftRight")) {
    console.log(`Shift has pressed! ${event.code}`);
    isShiftPressed = true;
  }
  if (!isCtrlPressed && (code === "ControlLeft" || code === "ControlRight")) {
    console.log(`Ctrl has pressed! ${event.code}`);
    isCtrlPressed = true;
  }
  if (!isAltPressed && (code === "AltRight" || code === "AltLeft")) {
    console.log(`Alt has pressed! ${event.code}`);
    isAltPressed = true;
  }
  if (isShiftPressed && isAltPressed) {
    keyBoard.changeLang();
  }
  console.log(`pressed btn = ${code}`);
  
});

document.addEventListener('keyup', function(event) {
  let code = event.code;
  if (isShiftPressed && (code === "ShiftLeft" || code === "ShiftRight")) {
    isShiftPressed = false;
  }
  if (isCtrlPressed && (code === "ControlLeft" || code === "ControlRight")) {
    isCtrlPressed = false;
  }
  if (isAltPressed && (code === "AltRight" || code === "AltLeft")) {
    isAltPressed = false;
  }

});


