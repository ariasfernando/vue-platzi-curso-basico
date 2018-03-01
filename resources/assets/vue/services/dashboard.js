import Q from 'q';
import _ from 'underscore-contrib';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
    getMenu() {
        const endpoint = endpoints.dashboard.getMenu;
        const deferred = Q.defer();
        const params = {
            endpoint
        };

        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });

        return deferred.promise;
    },
};