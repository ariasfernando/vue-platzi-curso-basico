import axios from 'axios';
import _ from 'lodash';

let call;

// Validate URL destination;
const urlAndDestination = {
  getMessage(field, args) {
    return 'URL address should be valid and reachable';
  },
  validate(value, args) {
    if (!validateUrl(value)) return false;
    return reachUrl(value);
  },
};


/*
  @param url Url to validate
  @return Promise, resolves to boolean
*/
function reachUrl(url) {
  const message = 'URL not reachable';
  return new Promise((resolve, reject) => {
    once({ url: '/api/validate-url', method: 'post', data: { url } })
      .then((res) => {
        resolve({
          valid: res.data.is_valid,
          data: res.data.is_valid ? undefined : { message },
        });
      })
      .catch(err => resolve({
        valid: false,
        data: { message },
      }));
  });
}

/*
  @param url Url to validate
  @return boolean
*/
function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}


// method to avoid more than one XHR call at once
function once(config) {
  if (call) {
    call.cancel();
  }
  call = axios.CancelToken.source();

  config.cancelToken = call.token;
  return axios(config);
}

const isValidJson = {
  getMessage() {
    return 'Please, enter a valid JSON.';
  },
  validate(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  },
};

// Export of custom validators for VeeValidate
export const customValidators = {
  urlAndDestination: {
    method: urlAndDestination,
    options: {
      immediate: false,
    },
  },
  isValidJson: {
    method: isValidJson,
    options: {},
  },
};
