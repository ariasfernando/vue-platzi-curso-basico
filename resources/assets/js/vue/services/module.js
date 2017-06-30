import Q from 'q'
import request from '../utils/request'
import _ from 'underscore-contrib'
import Module from '../models/module'
import endpoints from '../resources/endpoints'

export default {
  getModule(moduleId) {
    let endpoint = endpoints.module.getModule;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      search: { moduleId: moduleId }
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve({
        library: new Module(response.body.module),
        modules: response.body.modules
      })
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  getAllModules() {
    let endpoint = endpoints.module.getAllModules;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint
    };

    request[endpoint.method](params).then((response) => {
      let modules = [];
      _.each(response.body, function(v) {
        let module = new Module(v);
        modules.push(module);
      });

      deferred.resolve(modules);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  newModule() {
    let deferred = Q.defer();
    let module = new Module();
    deferred.resolve(module);
    return deferred.promise;
  },

  saveModule(moduleJson) {
    let endpoint = endpoints.module.saveModule();
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      data: moduleJson
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });
  },

  createModule(moduleJson) {
    let endpoint = endpoints.module.createModule();
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      data: moduleJson
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });
  },

  deleteModule(moduleId) {
    let endpoint = endpoints.module.deleteModule();
    let deferred = Q.defer();
    let params = {
      endpoint: endpoint,
      data: {
        moduleId: moduleId
      }
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });
  }
}