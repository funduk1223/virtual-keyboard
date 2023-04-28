let btnKeyboard1 = document.querySelector("#button1");
let btnKeyboard2 = document.querySelector("#button2");
let btnKeyboard3 = document.querySelector("#button3");

let virtualKeyboard = document.querySelector('.visual-keyboard');

const keyLayout = [
  ["`", "ё"], ["1", "!"],  ["2", '"'],  ["3", "#"],  ["4", "$"],  ["5", "%"],  ["6", "^"],  ["7", "&"],  ["8", "*"],  ["9", "("],  ["0", ")"],  ["backspace"],
  ["tab"],  ["q", "й"], ["w", "ц"], ["e", "у"], ["r", "к"], ["t", "е"], ["y", "н"], ["u", "г"], ["i", "ш"], ["o", "щ"], ["p", "з"], ["[", "х"], ["]", "ъ"],
  ["caps"],  ["a", "ф"], ["s", "ы"], ["d", "в"], ["f", "а"], ["g", "п"], ["h", "р"], ["j", "о"], ["k", "л"], ["l", "д"], [";", "ж"], ["'", "э"], ["enter"],
  ["shift"],  ["z", "я"], ["x", "ч"], ["c", "с"], ["v", "м"], ["b", "и"], ["n", "т"], ["m", "ь"], [",", "б"], [".", "ю"], ["?", "."], ["up"], ["shift"],
  ["space"],  ["left"], ["down"], ["right"], ["ctrl"]
];

let KEYS;
fetch('/keys.json')
  .then((response) => response.json())
  .then((responseJSON) => { 
    KEYS = responseJSON;
    const keyBoard = new KeyBoard(virtualKeyboard);
    keyBoard.init(KEYS);
  });


class KeyButton {

    constructor(...args) {
      this.mainLangValue = args[0];
      this.secondLangValue = args[1];
    }
}


class KeyBoard {

  constructor(elem) {
    this.elem = elem;
    elem.onclick = this.onClick.bind(this);
    this.keys = KEYS;
  }

  onClick(event){
    let element = event.target;
    if (element.nodeName === "BUTTON") {
      console.log(`this.elem = ${this.elem} menu class = ${element.id}`);
    }
  }

  init(obj) {
    let count = 0;
    // arrKeys.forEach(element => {
    //   const keyBtn = document.createElement("button");
    //   keyBtn.className = "key-button";
    //   this.keys[count] = {type: 'char', element};
    //   keyBtn.id = `${count++}`;
    //   keyBtn.innerText = `${element[0]}`;
     
    //   this.elem.appendChild(keyBtn);
    //   keyBtn.addEventListener('click', () => { console.log(element)});
    // });

    for (let key in obj) {
      const keyBtn = document.createElement("button");
      keyBtn.className = "key-button";
      keyBtn.id = `${key}`;
      keyBtn.innerText = `${obj[key].element.mainValue}`;
      this.elem.appendChild(keyBtn);
      keyBtn.addEventListener('click', () => { console.log(obj[key].element.mainValue)});
    }

    return this.keys;
  }

}

// let btnClass1 = new KeyButton(btnKeyboard1);
// let btnClass2 = new KeyButton(btnKeyboard2);
// let btnClass3 = new KeyButton(btnKeyboard3);

// virtualKeyboard.onclick = function(event) {
//   let element = event.target;
 
//   if (element.nodeName === "BUTTON") {
//     //console.log("target = " + element.tagName + ", this=" + this.tagName);
//     console.log(element.id);
//   }
   
// };

//console.log(JSON.stringify(keyBoard.init(keyLayout), " ", 4));

// Phisycal Keyboard handler to special buttons
let isShiftPressed = false;
let isCtrlPressed = false;
let isAltPressed = false;

document.addEventListener('keydown', function(event) {

  
  switch (event.code) {
    case "ShiftLeft":
      if (!isShiftPressed){
        console.log(`Shift has pressed! ${event.code}`);
        isShiftPressed = true;
      }
      break;
    case "ShiftRight":
      if (!isShiftPressed){
        console.log(`Shift has pressed! ${event.code}`);
        isShiftPressed = true;
      }
      break;
    case "ControlRight":
      if (!isCtrlPressed) {
        console.log(`Ctrl has pressed! ${event.code}`);
        isCtrlPressed = true;
      }
      break;
    case "ControlLeft":
      if (!isCtrlPressed) {
        console.log(`Ctrl has pressed! ${event.code}`);
        isCtrlPressed = true;
      }
      break;
    case "AltRight":
      if (!isAltPressed) {
        console.log(`Alt has pressed! ${event.code}`);
        isAltPressed = true;
      }
      break;
    case "AltLeft":
      if (!isAltPressed) {
        console.log(`Alt has pressed! ${event.code}`);
        isAltPressed = true;
      }
    default:
      break;
  }
  if (isShiftPressed && isAltPressed) {
    console.log(`change lang!`);
  }

  console.log(`pressed btn = ${event.code}`);

});

document.addEventListener('keyup', function(event) {

  switch (event.code) {
    case "ShiftLeft":
      if (isShiftPressed){
        isShiftPressed = false;
      }
      break;
    case "ShiftRight":
      if (isShiftPressed){
        isShiftPressed = false;
      }
      break;
    case "ControlRight":
      if (isCtrlPressed) {
        isCtrlPressed = false;
      }
      break;
    case "ControlLeft":
      if (isCtrlPressed) {
        isCtrlPressed = false;
      }
      break;
    case "AltRight":
      if (isAltPressed) {
        isAltPressed = false;
      }
      break;
    case "AltLeft":
      if (isAltPressed) {
        isAltPressed = false;
      }
    default:
      break;
  }
});

