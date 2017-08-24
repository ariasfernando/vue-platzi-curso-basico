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

    const campaignStore = store.state.campaign;
    const campaign = campaignStore.campaign;
    const settings = campaignStore.editedSettings;
    const modules = campaignStore.modules;
    const deferred = Q.defer();

    campaign.bodyHtml = data.bodyHtml;

    const dataCampaign = new Campaign({
      settings,
      campaign,
      modules,
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
  processCampaign(campaignId) {
    const endpoint = endpoints.campaign.processCampaign;
    const deferred = Q.defer();

    const params = {
      endpoint,
      json: {
        campaign_id: campaignId,
      },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  checkProcessStatus(processId) {
    const endpoint = endpoints.campaign.processStatus;
    const deferred = Q.defer();

    const params = {
      endpoint,
      search: {
        processId,
      },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  completeCampaign(campaign) {
    const deferred = Q.defer();

    this.processCampaign(campaign.campaign_id).then((response) => {
      deferred.resolve({
        campaignId: campaign.campaign_id,
        processed: response.processed || undefined,
        jobId: response.job || undefined,
      });
    }).catch((error) => {
      deferred.reject(error);
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
    // const modules = _.cloneDeep(campaignStore.modules);
    // const editedModules = campaignStore.editedModules;
    //
    // for (const edited of editedModules) {
    //   for (const key in edited.data) {
    //     modules[edited.moduleId].structure.columns[edited.columnId].components[edited.componentId][key] = edited.data[key];
    //   }
    // }

    return {
      campaign,
      settings: editedSettings,
    };
  },

  sendPreview(data) {
    const deferred = Q.defer();
    const endpoint = endpoints.campaign.sendPreview;
    const params = {
      json: {
        campaign_id: data.campaignId,
        mail: data.emailAddress,
      },
      endpoint: endpoints.campaign.sendPreview,
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
};
