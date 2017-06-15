import Q from 'q'
import _ from 'underscore'
import Vue from 'vue/dist/vue'

import VueResource from 'vue-resource/dist/vue-resource'
Vue.use(VueResource);

function requestResponse(method, params, options) {
  let deferred = Q.defer();

  options = options || {};

  options.url = exports.getPath(params.endpoint.path, params.search);
  options.data = params.data || undefined;
  options.formData = params.formData || undefined;
  options.json = params.json || undefined;

  Vue.http[method](options.url, options.json)
    .then(function (response) {
      let statusCode = (response && response.status) ? response.status : 500;

      if (statusCode !== 200) {
        deferred.reject(error);
      } else {
        if ( _.isString(response.body) ) {
          response.body = JSON.parse(response.body);
        }
        deferred.resolve(response);
      }
    })
    .catch((error) => {
      deferred.reject(error);
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
