const chai = require("chai");
const expect = chai.expect;
const should = chai.should;
const assert = chai.assert;

const Q  = require('q');
const request = require('request');

const baseUrl = process.env.APP_BASE_URL;

import campaignService from '../../resources/assets/js/vue/services/campaign'
import libraryService from '../../resources/assets/js/vue/services/library'
import moduleService from '../../resources/assets/js/vue/services/module'

startSession();

/*
 * == Test: Services
 */
describe("Services", () => {

    describe("== libraryService ==", () => {

        describe("getLibrary", () => {

            it('should return a library object in json format', (done) => {

              libraryService.fetchLibraries().then( (result) => {
                expect(result).to.equal('promise resolved');
                done();
              }).catch((error) => {
                assert.isNotOk(error,'Promise error ');
                done();
              });

            });
        });

    });

});

function startSession() {
  let deferred = Q.defer();

  let url = baseUrl + '/admin/login';
  let data = {
    email: 'emiliano@stensul.com',
    password: 'zaq123456'
  };

  request.post(url, data, function (error, response, body) {
    console.log(response.statusCode);
  });

  return deferred.promise;
}