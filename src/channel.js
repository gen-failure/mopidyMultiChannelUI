import Mopidy from 'mopidy'

export class Channel {
  constructor(params) {
    this.name = params.name
    this.wsURL = params.wsURL;
    this.ws = null;
    
    this.isPlaying = false;
    this.isPaused = false;
    this.isStopped = false;

    this.connected = false;

    this.libraryURI = null;
    this.tracklist = [];
    this.currentTrack = null;
    this.timePosition = 0;
    this.seeking = false;
    this.volume = 0;
    
    this.connect();
  }

  connect() {
    try {
      this.ws = new Mopidy({
        webSocketUrl : 'ws://' + this.wsURL,
        callingConvention : 'by-position-or-by-name'
      });
      this.ws.on(this.onEvent.bind(this));
      //TODO: Find the access to ws or fix it in mopidy way
      //this.ws.websocket.onclose = this.onClose;
    } catch(e) {
      console.log(e);
    }
  }

  onEvent(event,data) {
    switch(event) {
      case 'state:online':
        this.connected = true;
        this.init();
        break;
      case 'event:trackPlaybackStarted':
        this.currentTrack = data.tl_track.track;
        this.changeState('playing');
        break;
      case 'event:trackPlaybackResumed':
        this.changeState('playing');
        break;
      case 'event:trackPlaybackPaused':
        this.changeState('paused');
        break;
      case 'event:tracklistChanged':
        //TODO : Update tracklist
        break;
      case 'event:volumeChanged':
        this.volume=data.volume;
        break;
      case 'event:playbackStateChanged':
        this.ws.playback.getState().then((s) => {
          this.changeState(s);
        });
        break;
      case 'state:offline':
        this.connected = false;
        this.changeState('disconnect');
        break;
      case 'event:seeked':
        console.log('seeked');
        this.timePosition = data.time_position;
      default:
        console.log(event);
    }
  }

  init() {
    this.updateTracklist();
    this.getVolume();
    this.ws.playback.getState().then((d) => {
      this.changeState(d);
    });

  }

  updateTracklist() {
    this.ws.tracklist.getTracks().then((d) => {
      if (Array.isArray(d)) {
        this.tracks = d;
      } else {
        this.tracks = [];
      }
    });
  }

  //Check if this is really needed
  getCurrentTrack() {
    console.log('track updating');
    this.ws.playback.getCurrentTrack({}).then((d) => {
      this.currentTrack = d;
    })
  }

  getVolume() {
    this.ws.mixer.getVolume({}).then((d) => {
      console.log('volume from server: ');
      console.log(d);
      this.volume = d;
    });
  }

  setVolume() {
    this.ws.mixer.setVolume({volume : this.volume}).then((d) => {
      if (d === false) {
        //FIXME: There should be a way how to notify user that command was actually rejected
      }
    });
  }

  getCurrentTrackLength() {
    if (this.currentTrack != null) {
      return this.currentTrack.length;
    } else {
      return 0;
    }
  }

  //Giving aurelia direct acess to the var ends by getting and string instead of integer
  readTimePosition(v) {
    return this.timePosition;
  }

  getTimePosition() {
    console.log('Updating time position');
    this.ws.playback.getTimePosition().then((d) => {
      console.log(d);
      this.timePosition = d;
    });
  }

  updateSeek(v) {
    this.seeking = true;
    console.log('seeking to: ' + this.timePosition);
    console.log('maxValue: ' + this.getCurrentTrackLength());
    this.ws.playback.seek({time_position: parseInt(this.timePosition)}).then((d) => {
      this.seeking = false
      if (d == false) {
        //FIXME: Show error should be show to user
        this.ws.playback.getTimePositioin((d) => {
          this.timePosition = d;
        });
      }
    })
  }

  changeState(state) {
    this.isPlaying = false;
    this.isPaused = false;
    this.isStopped = false;
    switch(state) {
      case 'paused':
        this.isPaused = true;
        this.getCurrentTrack();
        this.getTimePosition();
        break;
      case 'playing':
        this.isPlaying = true;
        this.getCurrentTrack();
        this.getTimePosition();
        break;
      case 'stopped':
        this.isStopped=true;
        break;
      default:
        console.log('WARNING: Unknown state ' + state);
    }
  }

  pause() {
    this.ws.playback.pause({}).then((d) => {
    });;
  }

  resume() {
    this.ws.playback.resume({}).then((d) => {});
  }

  onClose() {
    this.connected = false;
  }

  browseLibrary(cb) {
    var o = {uri : null}
    this.ws.library.browse(o).then(cb);
  }

  tick() {
    //FIXME: It would be nice to teach Aurelia to use 
    console.log('tick');
    if(this.isPlaying && !this.seeking) this.timePosition = parseInt(this.timePosition) + 1000;
  }
}
