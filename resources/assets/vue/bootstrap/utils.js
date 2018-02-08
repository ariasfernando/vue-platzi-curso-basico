import 'url-search-params-polyfill';

module.exports = {
  log(msg) {
    const searchParams = new URLSearchParams(window.location.search);
    const debug = searchParams.get('debug');

    if (debug === 'true' || debug === '1') {
      console.log(msg);
    }
  },
};
