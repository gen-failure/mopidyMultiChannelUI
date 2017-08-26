export class UriToStrValueConverter {
  toView(value) {
    if (value === null) return 'Empty';
    return decodeURI(value);
  }

  fromView(value) {
    if (value === null) return 'Empty';
    return encodeURI(value);
  }
}

