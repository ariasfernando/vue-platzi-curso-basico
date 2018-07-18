/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint no-console: 0 */
/* global Application */

/* vendor import */
import nock from 'nock';
/* local import */
import store from 'store';
import mocks from 'resources/mocks';

/*
 * == Test: Models
 */
describe('== Library Store ==', () => {
  let baseUrl;
  beforeAll(() => {
    baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
  });
  afterAll(() => {
    baseUrl = null;
  });
  describe('Mutations', () => {
    it('trigger "loadModulesData", the data should be been registered in the state.modules', (done) => {
      // Create fake campaign
      let modulesData = {
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
      let moduleDataGetter = store.state.library.modules;

      // Expect stored data to be equal to fake object
      expect(modulesData).toEqual(moduleDataGetter);

      modulesData = null;
      moduleDataGetter = null;

      done();
    });
  });

  describe('Actions', () => {
    let original;
    beforeAll(() => {
      original = console.error;
    });

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
      original = null;
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
      let failResponse = {
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
        failResponse = null;
        done();
      });
    });
  });

  describe('Getters', () => {
    it('trigger "modules" and had a data', (done) => {
      let campaignData = {
        library_config: {
          fixedModules: '[{"key": "text","pos": 0,"mandatory": true}]',
        },
        campaign_data: {
          modules_data: mocks.library.getMenuItems,
        },
      };
      store.commit('campaign/loadCampaignData', campaignData);
      let mockObject1 = JSON.parse(JSON.stringify(mocks.library.getMenuItems[0]));
      let mockObject2 = JSON.parse(JSON.stringify(mocks.library.getMenuItems[1]));
      let compareObject = [
        { ...mockObject1, isFixed: true, fixedPosition: 0, type: 'virtual', mandatory: true },
        { ...mockObject2, isFixed: false, fixedPosition: undefined, mandatory: false },
      ];
      let dataModule = store.getters['library/modules'];

      expect(dataModule).toEqual(compareObject);

      campaignData = null;
      mockObject1 = null;
      mockObject2 = null;
      compareObject = null;
      dataModule = null;

      done();
    });
  });
});
