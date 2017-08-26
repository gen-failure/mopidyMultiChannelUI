import {bindable} from 'aurelia-framework';
export class MediaLibrary {     
  @bindable channels;
  @bindable selectedChannel;

  constructor() {
    this.paths = [];
    this.list = [];

    this.hasMusic = false;

    this.paths.push(null);
    this.canGoBack = false;

    this.tracksToAdd = [];
    this.message = ""
  }

  attached() {
    console.log(this.channels);
    console.log(this.selectedChannel);
    this.updatePath();
    var pstyle = 'background-color:black;';
    $('#ml-layout').w2layout({
      name: 'ml-layout',
      panels: [
        { type: 'top', size: 50, style: pstyle, overflow : 'hidden', content:$('#ml-header') },
        { type: 'main', style: pstyle, content:$('#ml-content') },
        { type: 'bottom', size: 30, style: pstyle, content:$('#ml-foot') }
      ]
    });
  }

  itemClick(item) {
    switch(item.type) {
      case 'directory':
        this.paths.push(item.uri);
        this.updatePath();
        break;
      case 'track':
        this.playTrack(item.uri);
        break;
      default:
        console.log('unhandled item type ' + item.type);
    }
  }

  updatePath() {
    if(this.channels[this.selectedChannel].connected == false) {
      window.setTimeout(this.updatePath.bind(this),100);
    } else {
      this.channels[this.selectedChannel].ws.library.browse({uri : this.paths[this.paths.length-1]}).then((d) => {
        this.list = d;
        if (this.paths.length > 1) {
          this.canGoBack = true
        } else {
          this.canGoBack = false;
        }
        this.hasMusic = this.list.find((item) => {
          if (item.type == 'track') {
            return true;
          } else {
            return false;
          }
        });
        this.message = this.paths[this.paths.length-1]
      });
    }
  }

  playTrack(uri) {
    this.addTrack(uri, (t) => {this.channels[this.selectedChannel].ws.playback.play(t)});
  }

  addTracks(play = false) {
    var tracksToAdd = [];
    this.list.forEach((item) => {
      if (item.type == 'track') {
        console.log(item);
        tracksToAdd.push(item.uri);
      }
    });

    this.channels[this.selectedChannel].ws.tracklist.add({'uris' : tracksToAdd}).then((d) => {
      console.log(d);
      if (play) {
        this.channels[this.selectedChannel].ws.playback.stop().then((d2) => {
          this.channels[this.selectedChannel].ws.playback.play({'tlid' : d[0].tlid});
          console.log('starting gp');
        });
      }
    });
  }

  addTrack(uri,cb) {
    this.channels[this.selectedChannel].ws.tracklist.add({'uri' : uri}).then((d) => {
      if (cb) cb(d);
    });
  }
  
  selectChannel() {
    this.updatePath();
  }
  getClass(c) {
    switch(c) {
      case 'directory': 
        return 'fa fa-folder';
        break;
      case 'track':
        return 'fa fa-music';
        break;
      default:
        return 'fa fa-question';
    }
  }

  goBack() {
    console.log(this.paths.length);
    if (this.paths.length > 1) this.paths.pop();
    this.updatePath();
  }
}
