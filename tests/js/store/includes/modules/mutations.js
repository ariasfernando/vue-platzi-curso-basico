/* eslint-disable max-len */
/* eslint-disable no-console */

/* eslint-env node, jest, es6 */

const {
  cloneDeep,
  mocks,
  moduleStore,
  getRows,
  createStore,
} = require('./config.js');

let data = {};
let original = () => { };
let store = () => { };
let moduleState = {};

describe('trigger mutation:', () => {
  beforeAll(() => {
    original = console.error;
    store = createStore({ strict: true, modules: { module: cloneDeep(moduleStore) } });
  });
  beforeEach(() => {
    console.error = jest.fn();
    store.commit('module/setModuleData', cloneDeep(mocks.module));
    data = { key: 'description', value: 'this is a description' };
    moduleState = store.state.module;
  });
  afterEach(() => {
    console.error.mockClear();
    console.error = original;
    moduleState = null;
  });
  afterAll(() => {
    original = null;
  });
  it('"setModuleData" with data, expect of the "module" state has been same to passed data', (done) => {
    store.commit('module/setModuleData', data);
    expect(moduleState.module).toEqual(data);
    done();
  });
  it('"setElementData" with Id of row and change the row with new data', (done) => {
    data = { elementId: mocks.row0.id, value: mocks.row1 };
    store.commit('module/setElementData', data);
    expect(getRows(moduleState)[0]).toEqual(mocks.row1);
    done();
  });
  it('"setElementData" with Id of column and change the column with new data', (done) => {
    data = { elementId: mocks.column1.id, value: mocks.column3 };
    store.commit('module/setElementData', data);
    expect(getRows(moduleState)[0].columns[1]).toEqual(mocks.column3);
    done();
  });
  it('"setElementData" with Id of element and change the element with new data', (done) => {
    data = { elementId: mocks.image0.id, value: mocks.button0 };
    store.commit('module/setElementData', data);
    expect(getRows(moduleState)[0].columns[0].components[0]).toEqual(mocks.button0);
    done();
  });
  it('"setModuleFields", with data, expect of the "module[status]" state has setted to "draft"', (done) => {
    data = { description: 'this is a description', status: 'finish' };
    store.commit('module/setModuleFields', data);
    expect(moduleState.module.description).toEqual(data.description);
    expect(moduleState.module.status).toEqual(data.status);
    done();
  });
  it('"slideToggles" with data, expect to change of the value', (done) => {
    store.commit('module/slideToggles', data);
    expect(moduleState.slideToggles[data.key]).toEqual(data.value);
    done();
  });
  it('"setCurrentElementId", expect of the "currentElementId" state has been Id', (done) => {
    store.commit('module/setCurrentElementId', 123456);
    expect(moduleState.currentElementId).toEqual(123456);
    done();
  });
  it('"setModuleHeight" with data, expect to change of the value', (done) => {
    store.commit('module/setModuleHeight', data);
    expect(moduleState.moduleHeight[data.key]).toEqual(data.value);
    done();
  });
  it('"setDraggable" with data, expect to change of the value', (done) => {
    store.commit('module/setDraggable', data);
    expect(moduleState.draggable[data.key]).toEqual(data.value);
    done();
  });
  it('"addColumn" with data, expect in the "modules" state has added column data', (done) => {
    store.commit('module/addColumn', { column: mocks.column3, rowId: mocks.row0.id });
    const columns = getRows(moduleState)[0].columns;
    // Check that the last column is the same as the one that is sent.
    expect(columns[columns.length - 1]).toEqual(mocks.column3);
    done();
  });
  it('"addRow" with data, expect in the "modules" state has added row data', (done) => {
    store.commit('module/addRow', { row: mocks.row0 });
    const rows = getRows(moduleState);
    expect(rows[rows.length - 1]).toEqual(mocks.row0);
    done();
  });
  it('"removeRows" with data, expect in the "modules" state has removed row', (done) => {
    store.commit('module/removeRows', { index: 1, number: 1 });
    expect(getRows(moduleState).length).toEqual(mocks.module.structure.rows.length - 1);
    done();
  });
  it('"removeColumn" with data, expect in the state "modules" has removed row', (done) => {
    store.commit('module/removeColumn', { rowId: mocks.row0.id, index: 1, number: 1 });
    expect(getRows(moduleState)[0].columns.length).toEqual(mocks.module.structure.rows[0].columns.length - 1);
    done();
  });
  it('"saveElementProperty" with data, expect to change a property of the subcomponent', (done) => {
    const payload = {
      elementId: mocks.column1.id,
      subComponent: 'container',
      link: 'attribute',
      property: 'something',
      value: '51%',
    };
    store.commit('module/saveElementProperty', payload);
    expect(
      getRows(moduleState)[0].columns[1][payload.subComponent][payload.link][payload.property],
    ).toEqual(payload.value);
    done();
  });
  it('"addComponent" with data, expect of the state "module" has been added new component data', (done) => {
    store.commit('module/addComponent', { element: mocks.text0, index: 0, columnId: mocks.column0.id });
    expect(getRows(moduleState)[0].columns[0].components[0]).toEqual(mocks.text0);
    done();
  });
  it('"removeElement" with data, expect of the state "module" has been removed the component data', (done) => {
    store.commit('module/removeElement', { elementId: mocks.image0.id });
    expect(getRows(moduleState)[0].columns[0].components).toBeEmptyArray();
    done();
  });
  it('"setPluginElementConfig" with data, expect to change a config of plugin', (done) => {
    const payload = {
      elementId: mocks.column1.id,
      plugin: 'columnBackgroundColor',
      path: 'config.library.config.set_images',
      type: 'data',
      value: 100,
    };
    store.commit('module/setPluginElementConfig', payload);
    expect(
      getRows(moduleState)[0].columns[1].plugins[payload.plugin][payload.type].config.library.config.set_images,
    ).toEqual(payload.value);
    done();
  });
  it('"setBuildingMode" with data, expect of the state "buildingMode" to equal to 0', (done) => {
    store.commit('module/setBuildingMode', 'mobile');
    expect(moduleState).toHaveProperty('buildingMode', 'mobile');
    done();
  });
  it('"toggleRaw", expect of the state "showRaw" to equal true', (done) => {
    store.commit('module/toggleRaw');
    expect(moduleState).toHaveProperty('showRaw', true);
    done();
  });
  it('"setListLibraries" with data, expect save data options of image has setted in library \'styleImageEditor\'',
    (done) => {
      store.commit('module/setListLibraries', {
        elementId: mocks.image0.id,
        plugin: 'styleImageEditor',
        response: true,
      });
      const linkPlugin = getRows(moduleState)[0].columns[0].components[0].plugins.styleImageEditor.config;
      const stateImageOptions = linkPlugin.library.config.set_images.options;
      const stateImageOptions2 = linkPlugin['sie-plugin-image-overlay_image'].config.overlay_gallery.config.set_images.options;
      expect(stateImageOptions).toBeTruthy();
      expect(stateImageOptions2).toBeTruthy();
      done();
    },
  );
});
