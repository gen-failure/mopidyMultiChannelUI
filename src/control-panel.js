import {bindable} from 'aurelia-framework';
import {Helpers} from './helpers';

export class ControlPanel {
  @bindable channel;
  @bindable cnumber;

  constructor() {
    console.log(this);
    this.volumeStep = 5;
    this.helpers = Helpers;
  }

  increaseVolume() {
    var nv = this.channel.volume + this.volumeStep;

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

  forward() {
    this.channel.ws.tracklist.nextTrack({'tl_track' : null}).then((d) => {
      this.channel.ws.playback.play({'tlid' : d.tlid});
    });
  }

  backward() {
    this.channel.ws.tracklist.previousTrack({'tl_track' : null}).then((d) => {
      this.channel.ws.playback.play({'tlid' : d.tlid});
    });
  }
}
