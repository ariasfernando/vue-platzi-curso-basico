import Vue from 'vue/dist/vue'
import store from '../store'
import Campaign from '../models/campaign'

export default {
  getCampaign() {
    // TODO: Get campaignId from arguments
    let campaignId = Application.globals.campaignId;
    let url = Application.globals.baseUrl + '/campaign/edit/' + campaignId + '?json';

    return Vue.http.get(url)
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  saveCampaign() {
    let url = Application.globals.baseUrl + '/campaign/save';
    let editedCampaign = this.getEditedData();

    return Vue.http.post(url, {
      data: editedCampaign
    })
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  cloneCampaign(campaignId) {
    let url = Application.globals.baseUrl + '/campaign/clone';
    let data = {
      campaign_id: campaignId
    };

    return Vue.http.post(url, data)
      .then((response) => Promise.resolve(response.body))
      .catch((error) => Promise.reject(error));
  },

  getEditedData() {
    let campaign = store.state.campaign;
    let editedSettings = store.state.editedSettings;

    // Edited modules
    let modules = store.state.modules;
    let editedModules = store.state.editedModules;

    for (let edited of editedModules) {
      for (let key in edited.data) {
        modules[edited.moduleId].columns[edited.columnId].components[edited.componentId][key] = edited.data[key];
      }
    }

    let dataCampaign = new Campaign({
      campaign: campaign,
      settings: editedSettings,
      modules: modules
    });

    return dataCampaign;
  }
}