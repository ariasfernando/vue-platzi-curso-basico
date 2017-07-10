import Q from 'q';
import _ from 'underscore-contrib';
import request from '../utils/request';
import Module from '../models/module';
import endpoints from '../resources/endpoints';

export default {
  getModule(moduleId) {
    const endpoint = endpoints.module.getModule;
    const deferred = Q.defer();
    const params = {
      endpoint,
      search: { moduleId },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  getAllModules() {
    const endpoint = endpoints.module.getAllModules;
    const deferred = Q.defer();
    const params = {
      endpoint,
    };

    request[endpoint.method](params).then((response) => {
      const modules = [];
      _.each(response.body, (v) => {
        const module = new Module(v);
        modules.push(module);
      });

      deferred.resolve(modules);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  newModule() {
    const deferred = Q.defer();
    const module = new Module();
    deferred.resolve(module);
    return deferred.promise;
  },

  saveModule(moduleJson) {
    const endpoint = endpoints.module.saveModule;
    const deferred = Q.defer();
    const params = {
      endpoint,
      json: moduleJson,
    };

    request[endpoint.method](params).then((response) => {
      if (response.body.message !== 'SUCCESS') {
        deferred.reject(response.body.message);
      } else {
        deferred.resolve(response.body);
      }
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  createModule(moduleJson) {
    const endpoint = endpoints.module.createModule;
    const deferred = Q.defer();
    const params = {
      endpoint,
      json: moduleJson,
    };

    request[endpoint.method](params).then((response) => {
      if (response.body.message !== 'SUCCESS') {
        deferred.reject(response.body.message);
      } else {
        deferred.resolve(response.body);
      }
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  deleteModule(moduleId) {
    const endpoint = endpoints.module.deleteModule;
    const deferred = Q.defer();
    const params = {
      endpoint,
      data: {
        moduleId,
      },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
};
