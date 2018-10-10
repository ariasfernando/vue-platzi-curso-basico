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
import apiStore from '@/store/apiStore';

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
        api: cloneDeep(apiStore),
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
    it('"setOauthToken" and expect set "loading" state to true', (done) => {
      let oauthToken = { access_token: '4CniN7av71WXSvPosXrCHb9dP6m98yi9kiBm9zqi' };
      store.commit('api/setOauthToken', oauthToken);
      let oauthTokenState = store.state.api.oauthToken;
      expect(oauthTokenState).toEqual(oauthToken);
      oauthToken = oauthTokenState = null;
      done();
    });
    it('"error" and expect trigger the ', (done) => {
      store.commit('api/error', 'message to put in the console error');
      expect(console.error).toHaveBeenCalled();
      expect(console.error.mock.calls[0][0]).toEqual('message to put in the console error');
      done();
    });
  });
});
