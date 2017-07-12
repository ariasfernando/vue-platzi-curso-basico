import Q from 'q';
import _ from 'underscore-contrib';
import request from '../utils/request';
import endpoints from '../resources/endpoints';
import store from '../store';
import Campaign from '../models/campaign';

export default {
  getCampaign(campaignId) {
    const deferred = Q.defer();
    const endpoint = endpoints.campaign.getCampaign;
    const params = {
      search: { campaignId },
      endpoint: endpoints.campaign.getCampaign,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  saveCampaign() {
    const endpoint = endpoints.campaign.getCampaign;
    const editedCampaign = this.getEditedData();
    const deferred = Q.defer();

    const params = {
      endpoint: endpoints.campaign.getCampaign,
      data: editedCampaign,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  cloneCampaign(campaignId) {
    const endpoint = endpoints.campaign.cloneCampaign;
    const deferred = Q.defer();
    const params = {
      endpoint: endpoints.campaign.cloneCampaign,
      data: {
        campaign_id: campaignId,
      },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });
  },

  getEditedData() {
    const campaign = store.state.campaign;
    const editedSettings = store.state.editedSettings;

    // Edited modules
    const modules = store.state.modules;
    const editedModules = store.state.editedModules;

    for (const edited of editedModules) {
      for (const key in edited.data) {
        modules[edited.moduleId].columns[edited.columnId].components[edited.componentId][key] = edited.data[key];
      }
    }

    const dataCampaign = new Campaign({
      campaign,
      settings: editedSettings,
      modules,
    });

    return dataCampaign;
  },
};
