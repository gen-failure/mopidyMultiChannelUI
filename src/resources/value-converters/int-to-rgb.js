export class IntToRGBValueConverter {
  toView(int) {
    if (int > 100) int = 100;
    if (int < 0) int = 0;
    var r = Math.floor(255 - (int*2.55));
    var g = Math.floor(0 + (int*2.55));
    return 'rgb('+r+','+g+',0)';
  }
}
