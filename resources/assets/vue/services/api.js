import Q from 'q';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
  uploadEmail(data) {
    const endpoint = endpoints.api.uploadEmail;
    const deferred = Q.defer();
    const params = {
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
  uploadedHistory(campaignId) {
    const endpoint = endpoints.api.uploadedHistory;
    const deferred = Q.defer();
    const params = {
      endpoint,
      search: {
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

  getFolders(apiDriver) {
    const endpoint = endpoints.api.getFolders;
    const deferred = Q.defer();
    const params = {
      path: 'api.getFolders',
      endpoint,
      search: {
        apiDriver,
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
