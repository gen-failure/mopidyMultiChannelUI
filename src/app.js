import {Channel} from 'channel'
import {MediaLibrary} from 'media-library'
import {ControlPanel} from 'control-panel'

export class App {
  constructor() {

    //loadConfigFile first
    var xhr = new XMLHttpRequest();

    xhr.open('get', './src/config.json', true);

    xhr.onreadystatechange = () => {
		  var status;
		  var data;
		
      if (xhr.readyState == 4) { // `DONE`
			  if (xhr.status == 200) {
				  this.config = JSON.parse(xhr.responseText);
          console.log('config');
          this.init()
			  } else {
          console.log(xhr);
          alert('no config file');
			  }
		  }
	  };

    xhr.send();
    
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
