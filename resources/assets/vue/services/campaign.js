import Q from 'q';
import _ from 'lodash';
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

  saveCampaign(data) {
    const endpoint = endpoints.campaign.saveCampaign;
    const editedCampaign = this.getEditedData();
    const deferred = Q.defer();

    editedCampaign.campaign.bodyHtml = data.bodyHtml;

    const dataCampaign = new Campaign({
      settings: editedCampaign.settings,
      campaign: editedCampaign.campaign,
      modules: editedCampaign.modules,
    });

    const params = {
      endpoint: endpoints.campaign.saveCampaign,
      json: dataCampaign,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve({
        campaignId: response.body,
        campaign: dataCampaign,
      });
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
    const campaignStore = store.state.campaign;
    const campaign = campaignStore.campaign;
    const editedSettings = campaignStore.editedSettings;

    // Edited modules
    const modules = _.cloneDeep(campaignStore.modules);
    const editedModules = campaignStore.editedModules;

    for (const edited of editedModules) {
      for (const key in edited.data) {
        modules[edited.moduleId].structure.columns[edited.columnId].components[edited.componentId][key] = edited.data[key];
      }
    }

    return {
      campaign,
      settings: editedSettings,
      modules,
    };
  },
};
