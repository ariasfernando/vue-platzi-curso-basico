import Q from 'q';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
  fetchTags() {
    const endpoint = endpoints.tag.fetchTags;
    const deferred = Q.defer();
    const params = {
      path: 'tag.fetchTags',
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
