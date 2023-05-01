export default class KeyButton {
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

  capsValue() {
    if (this.type !== 'func') {
      const keyLang = Object.entries(this.key);
      for (let index = 0; index <keyLang.length; index += 1) {
       
        const key = keyLang[index][1];
        if (key.value.match(/[a-zа-яё]/gi) !== null) {
          const buffer = key.value;
          key.value = key.shiftValue;
          key.shiftValue = buffer;
        }
        
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