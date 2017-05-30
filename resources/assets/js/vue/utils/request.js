import Q from 'q'
import request from 'request'
import _ from 'underscore'

function requestResponse(method, params, options) {
  let deferred = Q.defer();

  options = options || {};

  options.url = exports.getPath(params.endpoint.path, params.search);
  options.data = params.data || undefined;
  options.formData = params.formData || undefined;
  options.json = params.json || undefined;

  let xCsrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content') || '';
  options.headers = {
    'X-CSRF-TOKEN': xCsrfToken
  };

  request[method](options, function (error, response, body) {
    response = response || undefined;
    let statusCode = (response && response.statusCode) ? response.statusCode : 500;

    if (statusCode !== 200) {
      deferred.reject(error);
    } else {
      if ( _.isString(response.body) ) {
        response.body = JSON.parse(response.body);
      }
      deferred.resolve(response);
    }
  });

  return deferred.promise;
}

exports.get = function (params, options) {
  return requestResponse('get', params, options);
};

exports.post = function (params, options) {
  return requestResponse('post', params, options);
};

exports.put = function (params, options) {
  return requestResponse('put', params, options);
};

exports.delete = function (params, options) {
  return requestResponse('del', params, options);
};

exports.head = function (params, options) {
  return requestResponse('head', params, options);
};

exports.getPath = function (url, params) {
  if (!url) {
    return false;
  }

  for (let key in params) {
    if (!params[key] || params[key] === "") {
      let regex = new RegExp("([?|&])" + key + "=:" + key);
      url = url.replace(regex, "");
    } else {
      url = url.replace(":" + key, params[key]);
    }
  }
  return url;
};
