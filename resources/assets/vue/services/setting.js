import Q from 'q';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
  fetchSettings() {
    const endpoint = endpoints.setting.fetchSettings;
    const deferred = Q.defer();
    const params = {
      endpoint,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  saveSetting(settingJson) {
    const endpoint = endpoints.setting.saveSetting;
    const deferred = Q.defer();
    const params = {
      endpoint,
      json: settingJson,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
};
