import {bindable} from 'aurelia-framework';

export class Keyboard {
  @bindable targetInput;
  constructor() {
    //this.keyboard should be binded automatically as element
    this.specialCodes = {
      '8' : {
        show : '&#9003;',
        action : this.bcksp
      },
      '32' : {
        show : 'Space',
        action : null
      },
      '190' : {
        show : '.',
        action : () => {this.targetInput.value = this.targetInput.value + '.'}
      },
      '191' : {
        show : '/',
        action : () => {this.targetInput.value = this.targetInput.value + '/'}
      }
    };
  }

  attached() {
    Array.from(this.keyboard.getElementsByTagName('div')).forEach((row) => {
      Array.from(row.getElementsByTagName('button')).forEach((key) => {
        var code = key.getAttribute('data-code');
        if (this.specialCodes.hasOwnProperty(code)) {
          key.innerHTML=this.specialCodes[code].show;
        } else {
          key.innerHTML=String.fromCharCode(parseInt(code));
        }
      });
    });
  }

  doKeypress(e) {
    var code = parseInt(e.target.getAttribute('data-code'));

    if (this.specialCodes.hasOwnProperty(code) && this.specialCodes[code].action != null) {
      this.specialCodes[code].action.bind(this)();
    } else {
      this.targetInput.value = this.targetInput.value + String.fromCharCode(code);
    }
  }

  bcksp() {
    console.log(this);
    this.targetInput.value = this.targetInput.value.slice(0,-1);

  }

  enter() {

  }
}

