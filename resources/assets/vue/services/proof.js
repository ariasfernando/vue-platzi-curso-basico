import Q from 'q';
import _ from 'underscore-contrib';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
    create(data) {
        const endpoint = endpoints.proof.create;
        const deferred = Q.defer();
        const params = {
            endpoint,
            json: data
        };

        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });

        return deferred.promise;
    },
};