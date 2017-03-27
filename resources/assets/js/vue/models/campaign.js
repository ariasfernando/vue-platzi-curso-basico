function Campaign (data) {
    this.campaign_name = data.settings.campaignName || data.campaign.title;

    this.campaign_preheader = data.settings.campaignPreheader || data.campaign.campaign_data.campaign_preheader;
    this.preheader_visible = data.settings.campaignPreheaderVisible || false;
    this.tags = data.settings.tags || [];
    this.campaign_id = data.campaign.campaign_id;
    this.campaign_process = data.settings.campaignProcess || false;
    this.modules_data = data.modules;

    return this;
}

module.exports = Campaign;