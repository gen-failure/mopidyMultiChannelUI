export class IntToStrValueConverter {
  fromView(str) {
    return parseInt(str);
  }

  toView(int) {
    return String(int);
    console.log('converting');
  }
}
