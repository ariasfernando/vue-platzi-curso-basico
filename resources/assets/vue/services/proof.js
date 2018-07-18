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
    getJSON(path, campaignId) {
        const endpoint = endpoints.proof[path];
        const deferred = Q.defer();
        const params = {
            endpoint,
        };
        if (campaignId) {
            params.search = {
                campaignId
            }
        }
        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    getData(token) {
        const endpoint = endpoints.proof.data;
        const deferred = Q.defer();
        const params = {
            endpoint,
            search: {
                token
            }
        };
        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    getComments(token) {
        const endpoint = endpoints.proof.comments;
        const deferred = Q.defer();
        const params = {
            endpoint,
            search: {
                token
            }
        };
        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    postComment(token, data) {
        const endpoint = endpoints.proof.postComment;
        const deferred = Q.defer();
        const params = {
            endpoint,
            search: {
                token
            },
            json: data
        };
        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    postDecision(token, data) {
        const endpoint = endpoints.proof.postDecision;
        const deferred = Q.defer();
        const params = {
            endpoint,
            search: {
                token
            },
            json: data
        };
        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    deleteDecision(token) {
        const endpoint = endpoints.proof.deleteDecision;
        const deferred = Q.defer();
        const params = {
            endpoint,
            search: {
                token
            }
        };
        request[endpoint.method](params).then((response) => {
            deferred.resolve(response.body);
        }).catch((err) => {
            deferred.reject(err);
        });
        return deferred.promise;
    }
};
