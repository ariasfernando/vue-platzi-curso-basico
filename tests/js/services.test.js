/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* global Application */

import nock from 'nock';
import libraryService from 'services/library';
import mocks from 'resources/mocks';

require('dotenv').config();

process.env.APP_ENV = 'test';

/*
 * == Test: Services
 */
describe('== Services ==', () => {
  const baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
  afterAll(() => {
    nock.cleanAll();
    nock.restore();
  });
  describe('Library Services', () => {
    describe('Search Libraries', () => {
      it('Should return a list of libraries', (done) => {
        nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/admin/library/list')
        .reply(200, mocks.library.searchLibraries);
        libraryService.searchLibraries().then((result) => {
          expect(result).toEqual(mocks.library.searchLibraries);
        }).then(done, done);
      });
    });

    describe('Fetch Libraries', () => {
      it('Should return a list of libraries', (done) => {
        nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/dashboard/libraries')
        .reply(200, mocks.library.fetchLibraries);
        libraryService.fetchLibraries().then((result) => {
          expect(result).toEqual(mocks.library.fetchLibraries);
        }).then(done, done);
      });
    });

    // describe("Get Library", () => {
    //   it('Should return a library object', (done) => {
    //     libraryService.getLibrary().then((result) => {
    //     expect(result).to.equal(fixtures.library.getLibrary);
    //     }).then(done, done);
    //   });
    // });
  });
});
