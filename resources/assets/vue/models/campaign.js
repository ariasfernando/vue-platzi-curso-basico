function Campaign(data) {
  this.campaign_name = data.settings.campaignName || data.campaign.campaign_name;
  this.campaign_preheader = data.settings.campaignPreheader || data.campaign.campaign_data.campaign_preheader;
  this.preheader_visible = data.settings.campaignPreheaderVisible || false;
  this.tags = data.settings.tags || [];
  this.campaign_id = data.campaign.campaign_id;
  this.campaign_process = data.settings.campaignProcess || false;
  this.modules_data = data.modules;
  this.body_html = data.campaign.bodyHtml;
  this.auto_save = data.settings.autoSave || data.campaign.campaign_data.auto_save;
  this.template = data.campaign.campaign_data.template;

  return this;
}

module.exports = Campaign;