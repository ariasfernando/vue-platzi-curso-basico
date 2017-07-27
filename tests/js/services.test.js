import libraryService from '../../resources/assets/vue/services/library';
import fixtures from '../../resources/assets/vue/resources/fixtures';

require('dotenv').config();

process.env.APP_ENV = 'test';

const chai = require('chai');

const should = chai.should;
const expect = chai.expect;

/*
 * == Test: Services
 */
describe("== Services ==", () => {
    describe("Library Services", () => {
        describe("Fetch Libraries", () => {
            it('Should return a list of libraries', (done) => {
              libraryService.fetchLibraries().then((result) => {
                expect(result).to.equal(fixtures.library.fetchLibraries);
              }).then(done, done);
            });
        });

        // describe("Get Library", () => {
        //     it('Should return a library object', (done) => {
        //       libraryService.getLibrary().then((result) => {
        //         expect(result).to.equal(fixtures.library.getLibrary);
        //       }).then(done, done);
        //     });
        // });
    });
});