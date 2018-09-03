import Q from 'q';
import _ from 'underscore-contrib';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
    uploadEmail(data) {
        const endpoint = endpoints.api.uploadEmail;
        const deferred = Q.defer();
        const params = {
            path: 'api.searchLibraries',
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
    uploadedHistory(campaignId) {
        const endpoint = endpoints.api.uploadedHistory;
        const deferred = Q.defer();
        const params = {
            path: 'api.uploadedHistory',
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

};
