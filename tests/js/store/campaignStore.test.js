const chai = require('chai');
const expect = chai.expect;
import store from 'store';
import mocks from 'resources/mocks';

/*
 * == Test: Models
 */
describe('== Campaign Store ==', () => {

  describe('Mutations', () => {
    it('Should trigger "loadCampaignData" mutation', (done) => {
      // Create fake campaign
      const campaign = {
        testKey: true,
        campaign_data: {
          modules_data: {
            testModuleName: 'foo',
          },
        },
      };

      // Trigger loadCampaign mutation with fake data
      store.commit('campaign/loadCampaignData', campaign);

      // Get campaign data from state
      const campaignGetter = store.state.campaign.campaign;

      // Expect stored data to be equal to fake object
      expect(campaignGetter).to.deep.equal(campaign);

      done();
    });

    it('Should merge and update a campaign', (done) => {
      // Create fake campaign
      const campaign = {
        campaign_data: {
          campaign_settings: {},
        },
      };

      // Trigger loadCampaign mutation with fake data
      store.commit('campaign/loadCampaignData', campaign);

      const expectedColor = '#FFFFFF';

      const campaignSettings = {
        templateBackgroundColor: expectedColor,
      };

      store.commit('campaign/saveCampaignData', {
        name: 'campaign_settings',
        value: campaignSettings,
      });

      // Get campaign data from state
      const color = store.state.campaign.campaign.campaign_data.campaign_settings.templateBackgroundColor;

      // Expect stored data to be equal to fake object
      expect(color).to.equal(expectedColor);

      done();
    });
  });

  describe('Actions', () => {
    it('Should trigger "getCampaignData" async action and obtain the campaign data', (done) => {
      store.dispatch('campaign/getCampaignData', '5b045affe53553000d59b18c').then((res) => {
        expect(store.state.campaign.campaign).to.deep.equal(mocks.campaign.getCampaign.campaign);
        done();
      });
    });
  });

});
