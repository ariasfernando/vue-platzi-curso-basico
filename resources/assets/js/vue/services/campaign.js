import Q from 'q'
import request from '../utils/request'
import endpoints from '../resources/endpoints'
import store from '../store'
import Campaign from '../models/campaign'

export default {
  getCampaign(campaignId) {
    let deferred = Q.defer();
    let endpoint = endpoints.campaign.getCampaign;
    let params = {
      search: { campaignId: campaignId },
      endpoint: endpoints.campaign.getCampaign
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body)
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  saveCampaign() {
    let endpoint = endpoints.campaign.getCampaign;
    let editedCampaign = this.getEditedData();
    let deferred = Q.defer();

    let params = {
      endpoint: endpoints.campaign.getCampaign,
      data: editedCampaign
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  cloneCampaign(campaignId) {
    let endpoint = endpoints.campaign.cloneCampaign;
    let deferred = Q.defer();
    let params = {
      endpoint: endpoints.campaign.cloneCampaign,
      data: {
        campaign_id: campaignId
      }
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });
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