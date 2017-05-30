import Q from 'q'
import request from '../utils/request'
import _ from 'underscore'
import Library from '../models/library'
import endpoints from '../resources/endpoints'

export default {
  getLibrary(libraryId) {
    let endpoint = endpoints.library.getLibrary;
    let deferred = Q.defer();
    let params = {
      search: { libraryId: libraryId },
      endpoint: endpoint
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve({
        library: new Library(response.body.library),
        modules: response.body.modules
      })
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  newLibrary() {
    let endpoint = endpoints.library.newLibrary;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint
    };

    request[endpoint.method](params).then((response) => {
      let modules = [];
      _.each(response.body, function (module, key) {
        modules.push(key);
      });

      deferred.resolve({
        library: new Library(),
        modules: modules
      });
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  saveLibrary(formData) {
    let endpoint = endpoints.library.saveLibrary;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      json: formData
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body)
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  createLibrary(formData) {
    let endpoint = endpoints.library.createLibrary;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      json: formData
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body)
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  deleteLibrary(libraryId) {
    let endpoint = endpoints.library.deleteLibrary;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      json: {
        libraryId: libraryId
      }
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body)
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  fetchLibraries (data) {
    let endpoint = endpoints.library.fetchLibraries;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      json: data
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body)
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  }
}