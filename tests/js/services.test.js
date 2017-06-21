import libraryService from '../../resources/assets/js/vue/services/library';
import campaignService from '../../resources/assets/js/vue/services/campaign';
import moduleService from '../../resources/assets/js/vue/services/module';

require('dotenv').config();

process.env.APP_ENV = 'test';

const chai = require('chai');

const should = chai.should;
const expect = chai.expect;

/*
 * == Test: Services
 */
describe("Services", () => {
    describe("== libraryService ==", () => {
        describe("getLibrary", () => {
            it('should return a library object in json format', (done) => {
              libraryService.fetchLibraries().then((result) => {
                expect(result).to.have.property('total').and.to.be.a('number');
              }).then(done, done);
            });
        });
    });
});