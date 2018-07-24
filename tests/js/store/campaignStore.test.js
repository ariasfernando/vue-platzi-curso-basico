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
  });

  describe('Mutations', () => {
    it('Should trigger "getCampaignData" async action and obtain the campaign data', (done) => {
      store.dispatch('campaign/getCampaignData', '5b045affe53553000d59b18c').then((res) => {
        expect(store.state.campaign.campaign).to.deep.equal(mocks.campaign.getCampaign.campaign);
        done();
      });
    });
  });

});
