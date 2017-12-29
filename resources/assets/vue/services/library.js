import Q from 'q';
import _ from 'underscore-contrib';
import request from '../utils/request';
import Library from '../models/Library';
import endpoints from '../resources/endpoints';

export default {
  getLibrary(libraryId) {
    const endpoint = endpoints.library.getLibrary;
    const deferred = Q.defer();
    const params = {
      path: 'library.getLibrary',
      search: { libraryId },
      endpoint,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve({
        library: new Library(response.body.library),
        modules: response.body.modules,
      });
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  newLibrary() {
    const endpoint = endpoints.library.newLibrary;
    const deferred = Q.defer();
    const params = {
      path: 'library.newLibrary',
      endpoint,
    };

    request[endpoint.method](params).then((response) => {
      const modules = [];
      _.each(response.body, (module, key) => {
        modules.push(key);
      });

      deferred.resolve({
        library: new Library(),
        modules,
      });
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  saveLibrary(formData) {
    const endpoint = endpoints.library.saveLibrary;
    const deferred = Q.defer();
    const params = {
      path: 'library.saveLibrary',
      endpoint,
      json: formData,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  createLibrary(formData) {
    const endpoint = endpoints.library.createLibrary;
    const deferred = Q.defer();
    const params = {
      path: 'library.createLibrary',
      endpoint,
      json: formData,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  deleteLibrary(libraryId) {
    const endpoint = endpoints.library.deleteLibrary;
    const deferred = Q.defer();
    const params = {
      path: 'library.deleteLibrary',
      endpoint,
      json: {
        libraryId,
      },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  searchLibraries(data) {
    const endpoint = endpoints.library.searchLibraries;
    const deferred = Q.defer();
    const params = {
      path: 'library.searchLibraries',
      endpoint,
      json: data,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  fetchLibraries(data) {
    const endpoint = endpoints.library.fetchLibraries;
    const deferred = Q.defer();
    const params = {
      path: 'library.fetchLibraries',
      endpoint,
      json: data,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  espProviders() {
    const endpoint = endpoints.library.espProviders;
    const deferred = Q.defer();
    const params = {
      path: 'library.espProviders',
      endpoint,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
}