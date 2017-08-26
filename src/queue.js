import {bindable} from 'aurelia-framework';

export class Queue {
  @bindable channels;
  @bindable selectedChannel;

  constructor() {
    this.showSaveScreen = false;
    this.message = '';
  }

  attached() {
    var pstyle = 'background-color:black;';
    $('#q-layout').w2layout({
      name: 'q-layout',
      panels: [
        { type: 'top', size: 50, style: pstyle, overflow : 'hidden', content:$('#q-header') },
        { type: 'main', style: pstyle, overflow: 'scroll', content:$('#q-content') },
        { type: 'bottom', size: 30, style: pstyle, overflow: 'hidden', content: 'Placeholder'}
      ]
    });
  }

  toggleSaveScreen() {
    this.newPlaylistName.value='';
    this.showSaveScreen = true;

  }

  play(id) {
    console.log(id)
    this.channels[this.selectedChannel].ws.playback.play({tlid : id});
  }

  remove(id) {
    this.channels[this.selectedChannel].ws.tracklist.remove({criteria : {tlid : [id]}});
  }

  save() {
    console.log('Saving');

    var tracks = [];

    this.channels[this.selectedChannel].tracklist.forEach((item) => {
      tracks.push(item.track);
    });

    console.log(tracks);

    //FIXME uri_scheme should come from settings, not hardcode defined
    this.channels[this.selectedChannel].ws.playlists.create({'uri_scheme' : 'm3u', 'name' : this.newPlaylistName.value}).then((p) => {
      p.tracks = tracks;
      this.channels[this.selectedChannel].ws.playlists.save({'playlist' : p}).then((d) => {
        console.log(d);
        this.message = "playlist saved as: " + this.newPlaylistName.value;
        this.showSaveScreen=false;
      });
    });
  }

  clear() {
    console.log('clear');
    this.channels[this.selectedChannel].ws.tracklist.clear();
  }
}
