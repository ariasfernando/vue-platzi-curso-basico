import Q from 'q';
import _ from 'underscore-contrib';
import request from '../utils/request';
import Module from '../models/Module';
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
      const module = new Module(response.body);
      deferred.resolve(module);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  getCustomModule(moduleKey, campaignId) {
    const endpoint = endpoints.module.getCustomModule;
    const deferred = Q.defer();
    const params = {
      endpoint,
      search: {
        moduleKey,
        campaignId,
      },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  getAllModules(type) {
    let endpoint = endpoints.module.getAllModules;
    if (type) {
      endpoint = type === 'studio' ? endpoints.module.getAllStudioModules : endpoints.module.getAllCustomModules;
    }

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
      json: {
        moduleId,
      },
    };

    request[endpoint.method](params).then((response) => {
      if (!response.body.deleted || response.body.deleted !== moduleId) {
        deferred.reject(response.body.message);
      } else {
        deferred.resolve(response.body);
      }
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  uploadImages(data) {
    const deferred = Q.defer();
    const endpoint = endpoints.image.uploadImage;

    const promises = [];

    _.each(data.images, (image) => {
      const params = {
        endpoint,
        json: {
          data_image: image,
        },
      };
      promises.push(request[endpoint.method](params));
    });

    const images = [];

    Q.all(promises).then((responses) => {
      _.each(responses, (imageResponse) => {
        images.push(imageResponse.body.path);
      });

      deferred.resolve(images);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
};
