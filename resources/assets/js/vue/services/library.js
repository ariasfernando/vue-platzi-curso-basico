import Vue from 'vue/dist/vue'
import Library from '../models/library'

export default {
    getLibrary(libraryId) {
        let url = Application.globals.baseUrl + '/admin/library/edit?libraryId=' + libraryId;

        return Vue.http.get(url)
            .then( function(response) {
                return Promise.resolve({
                   library: new Library(response.body.library),
                   modules: response.body.modules
                });
            })
            .catch((error) => Promise.reject(error));
    },

    saveLibrary(libraryId, formData) {
        let url = Application.globals.baseUrl + '/admin/library/edit';

        return Vue.http.post(url, formData)
        .then((response) => Promise.resolve(response.body))
        .catch((error) => Promise.reject(error));
    },

    deleteLibrary(libraryId) {
        let url = Application.globals.baseUrl + '/admin/library/delete';

        return Vue.http.post(url, {
            data: {}
        })
        .then((response) => Promise.resolve(response.body))
        .catch((error) => Promise.reject(error));
    },

    createLibrary() {

    }
}