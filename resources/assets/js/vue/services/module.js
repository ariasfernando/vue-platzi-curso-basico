import Vue from 'vue/dist/vue'
import Module from '../models/module'

export default {
  getModule(moduleId) {
    let url = Application.globals.baseUrl + '/admin/module/edit?moduleId=' + moduleId;

    return Vue.http.get(url)
      .then(function (response) {
        return Promise.resolve({
          library: new Module(response.body.module),
          modules: response.body.modules
        });
      })
      .catch((error) => Promise.reject(error));
  },

  newLibrary() {
    let Module = new Module();
    return Promise.resolve(new Module());
  },

  saveModule(moduleJson) {
    let url = Application.globals.baseUrl + '/admin/module/edit';

    return Vue.http.post(url, moduleJson)
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  createModule(moduleJson) {
    let url = Application.globals.baseUrl + '/admin/module/create';

    return Vue.http.post(url, moduleJson)
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  deleteModule(moduleId) {
    let url = Application.globals.baseUrl + '/admin/module/delete';

    return Vue.http.post(url, {
      moduleId: moduleId
    })
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  }
}