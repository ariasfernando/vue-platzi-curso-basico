/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint max-len: 0 */
/* eslint no-console: 0 */
/* global Application */

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex/dist/vuex';
import { cloneDeep } from 'lodash';
import 'expect-more-jest';
/* local import */
import configStore from '@/store/configStore';
import configService from '@/services/config';

const localVue = createLocalVue();

localVue.use(Vuex);

function createStore(option) {
  return new Vuex.Store(option);
}

describe('== Api Store ==', () => {
  let original = () => {};
  let store = () => {};
  beforeAll(() => {
    original = console.error;
  });
  beforeEach(() => {
    console.error = jest.fn();
    store = createStore({
      strict: true,
      modules: {
        config: cloneDeep(configStore),
      },
    });
  });
  afterEach(() => {
    console.error.mockClear();
    console.error = original;
    store = null;
  });
  afterAll(() => {
    original = store = null;
  });
  describe('trigger mutation:', () => {
    it('"loadConfigData" and expect set "loading" state to true', (done) => {
      let data = ['global_settings', { enable_preheader: 1, auto_save: 1 }];
      store.commit('config/loadConfigData', data);
      let configState = store.state.config.config;
      expect(configState).toEqual({ global_settings: { enable_preheader: 1, auto_save: 1 } });
      data = configState = null;
      done();
    });
    it('"error" and expect trigger the "console.error"', (done) => {
      store.commit('config/error', 'message to put in the console error');
      expect(console.error).toHaveBeenCalled();
      expect(console.error.mock.calls[0][0]).toEqual('message to put in the console error');
      done();
    });
  });
  describe('trigger action:', () => {
    it('"getConfig" and expect trigger the "loadConfigData" mutation and call to "getConfig" of the \'configService\'', async (done) => {
      let setDataMock = jest.fn().mockResolvedValue({ enable_preheader: 1, auto_save: 1 });
      configService.getConfig = setDataMock;
      await store.dispatch('config/getConfig', 'global_settings').then(() => {
        setDataMock = null;
        done();
      });
    });
  });
  describe('trigger getter:', () => {
    it('"config" and expect get the "config" state', (done) => {
      let storeConfig = cloneDeep(configStore);
      let confStore = createStore({
        namespaced: true,
        state: {
          config: { global_settings: { enable_preheader: 1, auto_save: 1 } },
        },
        getters: storeConfig.getters,
        mutations: storeConfig.mutations,
        actions: storeConfig.actions,
      });

      expect(confStore.getters.config).toEqual({ global_settings: { enable_preheader: 1, auto_save: 1 } });

      storeConfig = confStore = null;

      done();
    });
  });
});
