import KEYS from './keysData.js';
import KeyBoard from './keyBoard.js';

// TODO: create a vertual keyboard also from scripts
function app() {
  const body = document.querySelector('body');
  const wrapper = document.createElement('section');
  wrapper.className = 'wrapper';
  body.appendChild(wrapper);
  const textArea = document.createElement('textarea');
  textArea.className = 'textarea';
  wrapper.appendChild(textArea);
  const virtualKeyboard = document.createElement('div');
  virtualKeyboard.className = 'virtual-keyboard';
  wrapper.appendChild(virtualKeyboard);
  const instruction = document.createElement('div');
  instruction.className = 'instruction';
  wrapper.appendChild(instruction);
  let inst = document.createElement('p');
  inst.innerText = 'Клавиатура создана в операционной системе Windows';
  instruction.appendChild(inst);
  inst = document.createElement('p');
  inst.innerText = 'Для переключения языка комбинация: левыe ctrl + alt';
  instruction.appendChild(inst);
  inst = document.createElement('p');
  inst.innerText = 'А также кнопка переключения языка между левым alt и пробелом';
  instruction.appendChild(inst);
  let language = localStorage.getItem('lang');
  language = language === null ? 'en' : language;
  const keyBoard = new KeyBoard(virtualKeyboard, textArea, language);
  keyBoard.init(KEYS);

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
  });

  document.addEventListener('keyup', (event) => {
    const { code } = event;
    keyBoard.buttonKeyUpHandler(code);
  });
}

app();
