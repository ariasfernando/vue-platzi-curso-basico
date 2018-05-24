import Q from 'q';
import _ from 'lodash';
import request from '../utils/request';
import endpoints from '../resources/endpoints';
import Vue from 'vue';

export default {
  uploadImages(data) {
    const deferred = Q.defer();
    const endpoint = endpoints.image.uploadImage;

    const promises = [];
    const campaignUrl = Vue.prototype.$_app.config.campaignImageUrl;

    _.each(data.images, (image) => {
      if (image.indexOf(campaignUrl) !== -1) {
        image = image.replace(campaignUrl, "");
      }

      const params = {
        endpoint,
        json: {
          campaign_id: data.campaignId,
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

  uploadModuleImages(data) {
    const deferred = Q.defer();
    const endpoint = endpoints.module.uploadImage;

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

  getMedia(library) {
    const deferred = Q.defer();
    const endpoint = endpoints.image.getMedia;

    const params = {
      endpoint,
      search: { 
        library
      }
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  getLibraries() {
    const deferred = Q.defer();
  
    const endpoint = endpoints.image.getLibraries;
  
    const params = {
      endpoint
    };
  
    request[endpoint.method](params).then(response => {
      deferred.resolve(response.body);
    }).catch(error => {
      deferred.reject(error);
    });
  
    return deferred.promise;
  }
};