export class IntToStrValueConverter {
  toView(str) {
    return parseInt(str);
  }

  fromView(int) {
    return String(int);
  }
}
