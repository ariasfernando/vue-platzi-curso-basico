module.exports = {
  log(msg) {
    const url = new URL(window.location.href);
    const debug = url.searchParams.get('debug');

    if (debug === 'true' || debug === '1') {
      console.log(msg);
    }
  },
};
