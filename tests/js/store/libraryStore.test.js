/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint no-console: 0 */
/* global Application */

import store from 'store';
import nock from 'nock';
import mocks from 'resources/mocks';

/*
 * == Test: Models
 */
describe('== Library Store ==', () => {
  const baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
  describe('Mutations', () => {
    it('trigger "loadModulesData", the data should be been registered in the state.modules', (done) => {
      // Create fake campaign
      const modulesData = {
        _id: '5b2c13af57ea5300113fc7b2',
        type: 'studio',
        key: 'text',
        name: 'text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-06-21 17:07:59',
        created_at: '2018-06-21 17:07:59',
      };

      // Trigger loadCampaign mutation with fake data
      store.commit('library/loadModulesData', modulesData);

      // Get campaign data from state
      const moduleDataGetter = store.state.library.modules;

      // Expect stored data to be equal to fake object
      expect(modulesData).toEqual(moduleDataGetter);

      done();
    });
  });

  describe('Actions', () => {
    const original = console.error;

    beforeEach(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error.mockClear();
      console.error = original;
    });
    afterAll(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('trigger "getModulesData" and return the library data', async (done) => {
      nock(baseUrl)
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/campaign/menu-items/5b2c13af57ea5300113fc7b2')
      .reply(200, mocks.library.getMenuItems);

      await store.dispatch('library/getModulesData', '5b2c13af57ea5300113fc7b2').then(() => {
        expect(store.state.library.modules).toEqual(mocks.library.getMenuItems);
        done();
      });
    });

    it('trigger "getModulesData" and return error', async (done) => {
      const failResponse = {
        message: 'Call to a member function getModules() on null',
        exception: 'Symfony\\Component\\Debug\\Exception\\FatalThrowableError',
        file: '/usr/src/app/app/Http/Controllers/CampaignController.php',
        line: 209,
        trace: [
          {
            function: 'getMenuItems',
            class: 'Stensul\\Http\\Controllers\\CampaignController',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Controller.php',
            line: 54,
            function: 'call_user_func_array',
          },
        ],
      };

      nock(baseUrl)
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/campaign/menu-items/E')
      .reply(500, failResponse);

      await store.dispatch('library/getModulesData', 'E').then(() => {
        expect(console.error).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Getters', () => {
    it('trigger "modules" and had a data', (done) => {
      const dataModule = store.getters['library/modules'];
      expect(dataModule).toEqual(mocks.library.getMenuItems);
      done();
    });
  });
});
