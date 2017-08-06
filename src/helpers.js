export class Helpers {
  static formatTime(time) {
    let m = Math.floor((time/1000)/60);
    let s = Math.floor(((time/1000)-m*60));

    var fs = (s < 10) ? ("0" + s) : s
    return  m + ':' + fs;
  }

  static formatTrack(track) {
    var str = "";
  }
}
