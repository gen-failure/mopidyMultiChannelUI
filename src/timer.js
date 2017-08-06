import {bindable} from 'aurelia-framework';

export class Timer {     
  @bindable track;
  constructor() {
    console.log(this.track);
  }

  formatTime() {
    let m = Math.floor((this.track.length/1000)/60);
    let s = Math.floor(((this.track.length/1000)-m*60));

    var fs = (s < 10) ? ("0" + s) : s
    return  m + ':' + fs;
  }
}
