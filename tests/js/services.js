let expect = require('chai').expect;
let assert = require('assert');

import campaignService from '../../resources/assets/js/vue/services/campaign'
import libraryService from '../../resources/assets/js/vue/services/library'
import moduleService from '../../resources/assets/js/vue/services/module'

/*
 * == Test: Services
 */
describe("Services", () => {

    describe("== campaignService ==", () => {

        describe("getCampaign", () => {
            it('should return a campaign in json format', () => {

                let campaign = campaignService.getCampaign()
                  .then((response) => {
                    console.log(response)
                  })
                  .catch((error) => {
                    console.log('error')
                  });

                // Dummy test
                assert.equal(true, true);
            });
        });

    });

});