import Mopidy from 'mopidy'

export class Channel {
  constructor(params) {
    this.name = params.name
    this.wsURL = params.wsURL;
    this.ws = null;
    
    this.currentState = 'stopped';
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

    this.nextTrack = null;
    this.prevTrack = null;

    this.title = "";
    this.playlists = [];
    
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
      this.ws.onclose = this.onClose;
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
        this.title = this.currentTrack.name;
        this.getNextTrack();
        this.getPrevTrack();
        this.changeState('playing');
        break;
      case 'event:trackPlaybackEnded':
        console.log('YES!!!! I DO EXIST!!!!!!');
        break;
      case 'event:trackPlaybackResumed':
        this.changeState('playing');
        break;
      case 'event:trackPlaybackPaused':
        this.changeState('paused');
        break;
      case 'event:tracklistChanged':
        this.updateTracklist();
        break;
      case 'event:volumeChanged':
        console.log('new volume ' + data.volume);
        this.volume=data.volume;
        break;
      case 'event:playbackStateChanged':
          this.changeState(data.new_state);
        break;
      case 'state:offline':
        this.connected = false;
        this.changeState('disconnect');
        break;
      case 'event:seeked':
        this.timePosition = data.time_position;
        break;
      case 'event:playlistDeleted':
        this.getPlaylists();
        break;
      case 'event:playlistChanged':
        this.getPlaylists();
        break;
      case 'event:streamTitleChanged':
        this.title = data.title;
        console.log(data.title);
      default:
        console.log(event);
        console.log(data);
    }
  }
  init() {
    console.log('initializing channel');
    this.updateTracklist();
    this.getVolume();

    this.mopidyCall('playback','getState',{},(d) => {
      this.changeState(d);
    })
    this.getPlaylists();
  }
  updateTracklist() {
    this.mopidyCall('tracklist','getTlTracks', {},(d) => {
      console.log(d);
      this.tracklist = d;
    });
  }
  //Check if this is really needed
  getCurrentTrack() {
    this.mopidyCall('playback','getCurrentTrack',{},(d) => {
      this.currentTrack = d;
      this.title = d.name;
    });
  }
  getPrevTrack() {
    this.mopidyCall('tracklist','previousTrack',{'tl_track' : null},(d) => {
        this.prevTrack = d;
      });
  }
  getNextTrack() {
    this.mopidyCall('tracklist','nextTrack',{'tl_track' : null},(d) => {
      this.nextTrack = d;
    });
  }
  getPlaylists() {
    this.mopidyCall('playlists','getPlaylists',{},(d) => {
    this.playlists = d;
    });
  }
  getVolume() {
    this.mopidyCall('mixer','getVolume',{},(d) => {
      this.volume = d;
    });
  }
  setVolume() {
    this.mopidyCall('mixer', 'setVolume', {volume:this.volume},(d) => {}) 
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
    this.mopidyCall('playback','getTimePosition',{},(d) => {
      this.timePosition = d;
    });
  }
  updateSeek(v) {
    this.seeking = true;
    
    this.mopidyCall('playback','seek',{time_position: parseInt(this.timePosition)},(d) => {
      this.seeking = false
      this.getTimePosition(); //FIXME --only in case of error?
    })
  }
  changeState(state) {
    this.currentState = state;
    this.isPlaying = false;
    this.isPaused = false;
    this.isStopped = false;
    switch(state) {
      case 'paused':
        this.isPaused = true;
        this.getCurrentTrack();
        this.getTimePosition();
        this.getNextTrack();
        this.getPrevTrack();
        this.getPlaylists();
        break;
      case 'playing':
        this.isPlaying = true;
        this.getCurrentTrack();
        this.getTimePosition();
        this.getNextTrack();
        this.getPrevTrack();
        this.getPlaylists();
        break;
      case 'stopped':
        this.isStopped=true;
        break;
      default:
        console.log('WARNING: Unknown state ' + state);
    }
  }
  pause() {
    this.mopidyCall('playback','pause',{},(d) => {});
  }
  resume() {
    this.mopidyCall('playback','resume',{},(d) => {});
  }
  onClose() {
    console.log('closed');
    this.connected = false;
  }
  browseLibrary(cb) {
    var o = {uri : null}
    this.mopidyCall('library','browse',o,cb);
  }
  mopidyCall(target,method,params,callback=(d) => {}) {
    var func = this.ws[target][method];

    if (typeof func == 'function') {
      if (document.getElementById('loadingScreen')) { 
        document.getElementById('loadingScreen').style.zIndex=999;
        document.getElementById('loadingScreen').style.display='block';
      }
      func.call(this, params).then((d) => {
        callback(d);
        if (document.getElementById('loadingScreen')) {
          document.getElementById('loadingScreen').style.zIndex=0;
          document.getElementById('loadingScreen').style.display='none';
        }
      })
    } else {
      //FIXME: This should do something
    }
  }
  tick() {
    if(this.isPlaying && !this.seeking) {
      this.timePosition = parseInt(this.timePosition) + 1000;
    }
  }
}
