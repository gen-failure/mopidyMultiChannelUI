import {Channel} from 'channel'
import {MediaLibrary} from 'media-library'
import {ControlPanel} from 'control-panel'

export class App {
  constructor() {

    $.getJSON('./src/config.json',(d) => {
      this.config = d;
      this.init();
    });
  }

  init() {
    this.showChannels = true;
    this.showPlaylist = false;
    this.showLibrary = false;
    this.selectedChannel = 0;

    this.channels = [];
    this.config['channels'].forEach((c) => {
      this.channels.push(new Channel(c));
    });
    window.app = this;

    //TODO: Are there some better ways how to handle this? Events maybe?
    this.tickTack = window.setInterval((i) => {
      this.channels.forEach((channel) => {
        channel.tick();
      });
    },1000);
  }

  showMediaLibrary(i) {
    console.log(i);
    this.showChannels = false;
    this.showPlaylist = false;
    this.showLibrary = true;

    console.log(this.channels[0]);
    window.c = this.channels[0].ws;
    this.channels[0].browseLibrary(console.log);
  }
}
