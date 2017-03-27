import _ from 'underscore'

let interceptors = {
    headerInterceptor(Vue) {
        Vue.http.interceptors.push((request, next) => {
            request.headers.set('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
            next();
        });
    }
};

module.exports = (Vue) => {
    _.each(interceptors, function(interceptor) {
        interceptor(Vue);
    });
};