import Vue from 'vue/dist/vue'
import Library from '../models/library'

export default {
    getLibrary(libraryId) {
        let url = Application.globals.baseUrl + '/admin/library/edit';
        let data = {
            libraryId: libraryId,
        };

        return Vue.http.get(url, data)
            .then((response) => Promise.resolve(response.body))
            .catch((error) => Promise.reject(error));
    },

    saveLibrary(libraryId) {
        let url = Application.globals.baseUrl + '/admin/library/save';

        return Vue.http.post(url, {
            data: {}
        })
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