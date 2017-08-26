import {bindable} from 'aurelia-framework'
export class Stream {
  @bindable channels;
  @bindable selectedChannel;
  constructor() {
    this.message = 'Hello world';
  }

  attached() {
    var pstyle = 'background-color:black;';
    $('#s-layout').w2layout({
      name: 's-layout',
      panels: [
        { type: 'top', size: 50, style: pstyle, overflow : 'hidden', content:$('#s-header') },
        { type: 'main', style: pstyle, content:$('#s-content') },
        { type: 'bottom', size: 30, style: pstyle, content:$('#s-foot') }
      ]
    });
  }

  openStream() {
    var url = this.streamURL.value;

    this.channels[this.selectedChannel].ws.tracklist.add({'uri' : url}).then((d) => {
      this.channels[this.selectedChannel].ws.playback.play({'tlid' : d[0].tlid});
    });
  }
}
