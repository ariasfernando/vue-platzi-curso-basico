import Vue from 'vue';

function Campaign(data) {
  this.campaign_name = data.settings.campaignName || data.campaign.campaign_name;
  this.campaign_preheader = data.settings.campaignPreheader || data.campaign.campaign_preheader;
  this.tracking = data.settings.tracking || data.campaign.campaign_data.tracking;
  this.preheader_visible = data.settings.campaignPreheaderVisible || false;
  this.tags = data.settings.tags || data.campaign.campaign_data.tags;
  this.campaign_id = data.campaign.campaign_id;
  this.campaign_process = data.settings.campaignProcess || false;
  this.modules_data = data.modules;
  this.body_html = data.campaign.bodyHtml;
  this.plain_text = data.campaign.plainText;
  this.auto_save = data.campaign.campaign_data.auto_save;
  this.favorite = data.campaign.isFavorite;
  this.template = data.campaign.campaign_data.template;
  this.campaign_settings = data.campaign.campaign_data.campaign_settings || {};

  // hack to save fonts
  this.campaign_fonts = Vue.prototype.$_app.config.fonts || {};

  return this;
}

export default Campaign;
