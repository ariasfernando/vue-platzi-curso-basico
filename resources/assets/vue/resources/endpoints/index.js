require('dotenv').config();

const baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;

module.exports = {
  library: {
    getLibrary: { method: 'get', path: `${baseUrl}/admin/library/edit?libraryId=:libraryId` },
    newLibrary: { method: 'get', path: `${baseUrl}/admin/module/modules` },
    saveLibrary: { method: 'post', path: `${baseUrl}/admin/library/edit` },
    createLibrary: { method: 'post', path: `${baseUrl}/admin/library/create` },
    deleteLibrary: { method: 'post', path: `${baseUrl}/admin/library/delete` },
    fetchLibraries: { method: 'post', path: `${baseUrl}/admin/library/list` },
    espProviders: { method: 'post', path: `${baseUrl}/admin/library/esp` },
  },
  module: {
    getModule: { method: 'get', path: `${baseUrl}/admin/module/edit?moduleId=:moduleId` },
    getCustomModule: { method: 'get', path: `${baseUrl}/template/module?key=:moduleKey&campaign_id=:campaignId` },
    getAllModules: { method: 'get', path: `${baseUrl}/admin/module/modules` },
    saveModule: { method: 'post', path: `${baseUrl}/admin/module/save` },
    deleteModule: { method: 'post', path: `${baseUrl}/admin/module/delete` },
  },
  campaign: {
    getCampaign: { method: 'get', path: `${baseUrl}/campaign/edit/:campaignId?json` },
    saveCampaign: { method: 'post', path: `${baseUrl}/campaign/save` },
    cloneCampaign: { method: 'post', path: `${baseUrl}/campaign/clone` },
  },
};