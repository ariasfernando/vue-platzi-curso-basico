import Q from 'q';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
  getConfig(key) {
    const endpoint = endpoints.config.getConfig;
    const deferred = Q.defer();
    const params = {
      endpoint,
      search: {
        key,
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
