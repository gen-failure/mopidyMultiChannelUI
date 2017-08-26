import {bindable} from 'aurelia-framework'

export class Playlists {
  @bindable channels;
  @bindable selectedChannel;

  constructor() {
  
  }

  attached() {
    var pstyle = 'background-color:black;';
    $('#p-layout').w2layout({
      name: 'p-layout',
      panels: [
        { type: 'top', size: 50, style: pstyle, overflow : 'hidden', content:$('#p-header') },
        { type: 'main', style: pstyle, content:$('#p-content') },
        { type: 'bottom', size: 30, style: pstyle, content:$('#p-foot') }
      ]
    });
  }

  remove(uri) {
    this.channels[this.selectedChannel].ws.playlists.delete({'uri' : uri });
  }

  play(uri) {

    var list = [];
    this.channels[this.selectedChannel].ws.playlists.getItems({'uri' : uri}).then((data) => {
      data.forEach((item) => {
        list.push(item.uri);
      });
      this.channels[this.selectedChannel].ws.tracklist.clear().then((r1) => {
        console.log(data);
        this.channels[this.selectedChannel].ws.tracklist.add({'uris' : list}).then((r2) => {
          this.channels[this.selectedChannel].ws.playback.play();
        });
      })
    });
  }
}
