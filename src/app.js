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
  
  attached() {
    var pstyle = 'background-color:black;';
    $('#main').w2layout({
      name: 'layout',
      panels: [
        { type: 'left', size: 200, style: pstyle, content: $('nav#sidebar') },
        { type: 'main', style: pstyle, content: $('div#content') }
      ]
   });
   window.setTimeout(() => {
     //$(window).trigger('resize');
   }, 1000);
  }
  init() {
    this.showChannels = true;
    this.showPlaylists = false;
    this.showLibrary = false;
    this.showQueue = false;
    this.showStream = false;
    this.selectedChannel = 0;

    this.showHomeButton = this.config.showHomeButton;
    this.showBackButton = this.config.showBackButton;

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

  showMediaLibrary() {
    this.uiOff();
    this.showLibrary = true;
    //FIXME: Ugly hack, to be sure the media library layout is always fine
    $(window).trigger('resize');
  }
  doShowQueue() {
    this.uiOff();
    this.showQueue = true;
    //FIXME: Ugly hack, to be sure the media library layout is always fine
    $(window).trigger('resize');
  }
  
  showAllPlaylists() {
    
    this.uiOff();
    this.showPlaylists = true;
    $(window).trigger('resize');
  }

  showAllChannels() {
    this.uiOff();
    this.showChannels = true;
  }

  doShowStream() {
    this.uiOff();
    this.showStream = true;
    $(window).trigger('resize')
  }

  uiOff() {
    this.showQueue = false
    this.showChannels = false;
    this.showPlaylists = false;
    this.showLibrary = false;
    this.showStream = false;
  }

  goHome() {
    document.location.href='about:home';
  }

  goBack() {
    window.history.back();
  }
}
