import Vue from 'vue/dist/vue';

function Campaign(data) {
  this.campaign_name = data.settings.campaignName || data.campaign.campaign_name;
  this.campaign_preheader = data.settings.campaignPreheader || data.campaign.campaign_data.campaign_preheader;
  this.preheader_visible = data.settings.campaignPreheaderVisible || false;
  this.tags = data.settings.tags || [];
  this.campaign_id = data.campaign.campaign_id;
  this.campaign_process = data.settings.campaignProcess || false;
  this.modules_data = data.modules;
  this.body_html = data.campaign.bodyHtml;
  this.auto_save = data.settings.autoSave;
  this.favorite = data.campaign.isFavorite;
  this.template = data.campaign.campaign_data.template;
  this.campaign_settings = data.campaign.campaign_data.campaign_settings || {};

  // hack to save fonts
  this.campaign_fonts = Vue.prototype.$_app.config.fonts || {};

  return this;
}

export default Campaign;
