import {bindable} from 'aurelia-framework';
import {Helpers} from './helpers';

export class ControlPanel {
  @bindable channel;
  @bindable cnumber;

  constructor() {
    this.volumeStep = 5;
    this.helpers = Helpers;
  }

  increaseVolume() {
    console.log(this.channel.volume);
    console.log(this.volumeStep);
    console.log(typeof this.channel.volume);
    var nv = this.channel.volume + this.volumeStep;

    console.log('nv -> ' + nv);
    if (nv > 100) nv=100;

    this.channel.volume=nv;
    this.channel.setVolume();
  }

  decreaseVolume() {
    var nv = this.channel.volume - this.volumeStep;

    if (nv < 0) nv = 0;
    
    this.channel.volume=nv;
    this.channel.setVolume();
  }
}
