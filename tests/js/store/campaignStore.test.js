/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint no-console: 0 */
/* global Application */

/* vendor import */
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex/dist/vuex';
import { cloneDeep } from 'lodash';
import nock from 'nock';
/* local import */
// import libraryStore from '@/store/libraryStore';
// import moduleStore from '@/store/moduleStore';
import campaignStore from '@/store/campaignStore';
// import mocks from '@/resources/mocks';

const localVue = createLocalVue();

localVue.use(Vuex);

function createStore(option) {
  return new Vuex.Store(option);
}

/*
 * == Test: Models
 */
describe('== Library Store ==', () => {
  let baseUrl;
  let store;
  beforeAll(() => {
    baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
  });
  beforeEach(() => {
    store = createStore({
      strict: true,
      modules: {
        campaign: cloneDeep(campaignStore),
      },
    });
  });
  afterEach(() => {
    store = null;
  });
  afterAll(() => {
    baseUrl = null;
  });
  describe('trigger muttation:', () => {
    it('"campaignValidated" and expect of set "campaignValidated" state to true', (done) => {
      let status = true;

      store.commit('campaign/campaignValidated', status);

      let stateCampaignValidated = store.state.campaign.campaignValidated;

      expect(stateCampaignValidated).toBeTruthy();

      status = null;
      stateCampaignValidated = null;

      done();
    });
    it('"campaignCanBeProcessed" and expect of set "campaign.campaign_data.can_be_processed" state to true', (done) => {
      let status = true;
      let newStruct = {
        campaign_name: 'Untitled Email',
        locale: 'en_us',
        campaign_id: '5b64b80f02a4cd00160fade2',
        campaign_data: {
          _id: '5b64b80f02a4cd00160fade2',
          campaign_name: 'Untitled Email',
          lower_campaign_name: 'untitled email',
          locale: 'en_us',
          modules_data: [{
            _id: '5b3ce34792f8ef00137bb105',
            type: 'virtual',
            key: 'text_458798',
            name: 'text',
            structure: {},
            plugins: {},
            status: 'publish',
            updated_at: '2018-08-03 16:09:09',
            created_at: '2018-07-04 11:09:59',
            isFixed: true,
            fixedPosition: 0,
            mandatory: true,
          }],
        },
      };

      store.commit('campaign/loadCampaignData', newStruct);
      store.commit('campaign/campaignCanBeProcessed', status);

      let stateCampaignBeProcessed = store.state.campaign.campaign.campaign_data.can_be_processed;

      expect(stateCampaignBeProcessed).toBeTruthy();

      status = null;
      newStruct = null;
      stateCampaignBeProcessed = null;

      done();
    });
    it('"loadCampaignData" and expect of set "campaign" state a new data object', (done) => {
      let campaignData = {
        campaign_name: 'Untitled Email',
        locale: 'en_us',
        campaign_id: '5b64b80f02a4cd00160fade2',
        campaign_data: {
          _id: '5b64b80f02a4cd00160fade2',
          campaign_name: 'Untitled Email',
          lower_campaign_name: 'untitled email',
          locale: 'en_us',
          modules_data: [{
            _id: '5b3ce34792f8ef00137bb105',
            type: 'virtual',
            key: 'text_458798',
            name: 'text',
            structure: {},
            plugins: {},
            status: 'publish',
            updated_at: '2018-08-03 16:09:09',
            created_at: '2018-07-04 11:09:59',
            isFixed: true,
            fixedPosition: 0,
            mandatory: true,
          }],
        },
      };

      store.commit('campaign/loadCampaignData', campaignData);

      let stateCampaign = store.state.campaign.campaign;

      expect(stateCampaign).toEqual(campaignData);

      campaignData = null;
      stateCampaign = null;

      done();
    });
    it('"updateEmailCanvas" and expect has set "modules" state, a new array of modules', (done) => {
      let modulesData = [
        {
        _id: '5b3ce34792f8ef00137bb105',
        type: 'virtual',
        key: 'text_458798',
        name: 'text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:09:09',
        created_at: '2018-07-04 11:09:59',
        isFixed: true,
        fixedPosition: 0,
        mandatory: true,
        },
        {
          _id: '5b64bf6602a4cd00122d0353',
          type: 'studio',
          key: 'banner',
          name: 'banner',
          structure: {},
          plugins: {},
          status: 'publish',
          updated_at: '2018-08-04 12:41:49',
          created_at: '2018-08-03 16:47:34',
          isFixed: false,
          mandatory: false,
          data: [],
          idInstance: 860980,
        },
        {
          _id: '5b64bb6902a4cd00153af972',
          type: 'studio',
          key: 'body',
          name: 'body',
          structure: {},
          plugins: {},
          status: 'publish',
          updated_at: '2018-08-03 16:30:33',
          created_at: '2018-08-03 16:30:33',
          isFixed: false,
          mandatory: false,
          data: [],
          idInstance: 169033,
        },
        {
          _id: '5b64b74a02a4cd000d42aad2',
          type: 'studio',
          key: 'untitled_module',
          name: 'text image',
          structure: {},
          plugins: {},
          status: 'publish',
          updated_at: '2018-08-04 12:42:51',
          created_at: '2018-08-03 16:12:58',
          data: [],
          idInstance: 567456,
        },
        {
          _id: '5b64b94002a4cd0013159bf2',
          type: 'studio',
          key: 'image_text',
          name: 'image text',
          structure: {},
          plugins: {},
          status: 'publish',
          updated_at: '2018-08-04 12:42:15',
          created_at: '2018-08-03 16:21:20',
          data: [],
          idInstance: 278717,
        },
      ];

      store.commit('campaign/updateEmailCanvas', modulesData);

      let stateModules = store.state.campaign.modules;

      expect(stateModules).toEqual(modulesData);

      modulesData = null;
      stateModules = null;

      done();
    });
    it('"changeBuildingMode" and expect has set "buildingMode" state, to mobile', (done) => {
      let modulesData = 'mobile';

      store.commit('campaign/changeBuildingMode', modulesData);

      let stateBuildingMode = store.state.campaign.buildingMode;

      expect(stateBuildingMode).toEqual(modulesData);

      modulesData = null;
      stateBuildingMode = null;

      done();
    });
    it('"setDirty" and expect of set "dirty" state to true', (done) => {
      let dirty = true;

      store.commit('campaign/setDirty', dirty);

      let stateDirty = store.state.campaign.dirty;

      expect(stateDirty).toBeTruthy();

      dirty = null;
      stateDirty = null;

      done();
    });
    it('"setUpdatedAt" and expect of set "campaign.campaign_data.updated_at" state, update date', (done) => {
      let updatedAt = '2018-08-04 16:53:53.000000';
      let newStruct = {
        campaign_data: {
          updated_at: '',
        },
      };

      store.commit('campaign/loadCampaignData', newStruct);
      store.commit('campaign/setUpdatedAt', updatedAt);

      let stateCampaignUpdateAt = store.state.campaign.campaign.campaign_data.updated_at;

      expect(stateCampaignUpdateAt).toEqual(updatedAt);

      updatedAt = null;
      newStruct = null;
      stateCampaignUpdateAt = null;

      done();
    });
    xit('setToggleImageEditor', () => {});
  });

  xdescribe('trigger actions', () => {
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

    it('', (done) => {
      done();
    });

    it('', (done) => {
      done();
    });
  });

  xdescribe('trigger getters', (done) => {
    it('', () => {
      done();
    });
  });
});
