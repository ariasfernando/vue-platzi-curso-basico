import Q from 'q';
import _ from 'lodash';
import request from '../utils/request';
import endpoints from '../resources/endpoints';
import store from '../store';
import Campaign from '../models/Campaign';

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
  getCampaignPublic(campaignId) {
    const deferred = Q.defer();
    const endpoint = endpoints.campaign.getCampaignPublic;
    const params = {
      search: { campaignId },
      endpoint: endpoints.campaign.getCampaignPublic,
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
    campaign.template = data.template;

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
        campaignId: response.body.campaign_id,
        campaign: dataCampaign,
        updatedAt: response.body.updated_at.date,
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
  lockCampaign(campaignId) {
    const endpoint = endpoints.campaign.lockCampaign;
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
  unlockCampaign(campaignId) {
    const endpoint = endpoints.campaign.unlockCampaign;
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
  pingLock(data) {
    const endpoint = endpoints.campaign.pingLock;
    const deferred = Q.defer();
    const params = {
      endpoint,
      json: {
        campaign_id: data.campaignId,
        window_id: data.windowId,
      },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  favoriteCampaign(campaignId) {
    const endpoint = endpoints.campaign.favoriteCampaign;
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
        subject: data.subject || '',
        preheader: data.preheader || '',
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

  processPlainText(campaignId) {
    const deferred = Q.defer();
    const endpoint = endpoints.campaign.processPlainText;
    const params = {
      endpoint,
      search: { campaignId },
    };

    request[endpoint.method](params).then((response) => {
      deferred.resolve(response.body);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },
  logTime(campaignId, time) {
    const endpoint = endpoints.campaign.logTime;
    const params = { 
      endpoint,
      json: {
        campaign_id: campaignId,
        time,
      },
    };
    request[endpoint.method](params);
  },
};
