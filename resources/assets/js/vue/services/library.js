import Vue from 'vue/dist/vue'
import Library from '../models/library'
import _ from 'underscore'

export default {
  getLibrary(libraryId) {
    let url = Application.globals.baseUrl + '/admin/library/edit?libraryId=' + libraryId;

    return Vue.http.get(url)
      .then(function (response) {
        return Promise.resolve({
          library: new Library(response.body.library),
          modules: response.body.modules
        });
      })
      .catch((error) => Promise.reject(error));
  },

  newLibrary() {
    let url = Application.globals.baseUrl + '/admin/module/modules';

    return Vue.http.get(url)
      .then(function (response) {
        let modules = [];
        _.each(response.body, function (module, key) {
          modules.push(key);
        });

        return Promise.resolve({
          library: new Library(),
          modules: modules
        });
      })
      .catch((error) => Promise.reject(error));
  },

  saveLibrary(formData) {
    let url = Application.globals.baseUrl + '/admin/library/edit';

    return Vue.http.post(url, formData)
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  createLibrary(formData) {
    let url = Application.globals.baseUrl + '/admin/library/create';

    return Vue.http.post(url, formData)
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  deleteLibrary(libraryId) {
    let url = Application.globals.baseUrl + '/admin/library/delete';

    return Vue.http.post(url, {
      libraryId: libraryId
    })
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  fetchLibraries (data) {
    let url = Application.globals.baseUrl + '/admin/library/list';

    return Vue.http.post(url,data)
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  }
}