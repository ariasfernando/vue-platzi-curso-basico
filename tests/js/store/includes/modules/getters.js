/* eslint-env node, jest, es6 */

const {
  cloneDeep,
  moduleStore,
  mocks,
  createStore,
} = require('./config.js');

describe('trigger getter:', () => {
  let store = () => {};
  beforeEach(() => {
    store = createStore({
      strict: true,
      modules: {
        module: cloneDeep(moduleStore),
      },
    });
  });

  afterAll(() => {
    store = null;
  });

  it('"module", expect state module has object', (done) => {
    store.commit('module/setModuleData', mocks.module.getModule);
    let getDataModule = store.getters['module/module'];

    expect(getDataModule).toEqual(mocks.module.getModule);

    getDataModule = null;

    done();
  });
  it('"buildingMode", expect state buildingMode has \'mobile\'', (done) => {
    store.commit('module/setBuildingMode', 'mobile');

    let getDataBuildingMode = store.getters['module/buildingMode'];

    expect(getDataBuildingMode).toEqual('mobile');

    getDataBuildingMode = null;

    done();
  });
  it('"showRaw", expect state showRaw has true', (done) => {
    store.commit('module/toggleRaw', 'mobile');

    let getDataBuildingMode = store.getters['module/showRaw'];

    expect(getDataBuildingMode).toEqual(true);

    getDataBuildingMode = null;

    done();
  });
});
