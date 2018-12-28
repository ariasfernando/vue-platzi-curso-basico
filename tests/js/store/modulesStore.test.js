/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint import/no-extraneous-dependencies:0 */
/* eslint max-len: 0 */
/* eslint no-console: 0 */
/* global Application */

/* vendor import */
import Vue from 'vue';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex/dist/vuex';
import { cloneDeep } from 'lodash';
import nock from 'nock';
import 'expect-more-jest';
/* local import */
import moduleStore from '@/store/moduleStore';
import campaignStore from '@/store/campaignStore';
import mocks from '@/resources/mocks';

const localVue = createLocalVue();

localVue.use(Vuex);

function createStore(option) {
  return new Vuex.Store(option);
}

describe('== Module Store ==', () => {
  describe('trigger mutation:', () => {
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
          module: cloneDeep(moduleStore),
          campaign: cloneDeep(campaignStore),
        },
      });
    });

    afterEach(() => {
      console.error.mockClear();
      console.error = original;
    });

    afterAll(() => {
      original = store = null;
    });
    it('"setLoader" and expect of set "loading" state to true', (done) => {
      store.commit('module/setLoader', true);
      // Get loading data from state
      let loadingModule = store.state.module.loading;

      // Expect loading data to be equal to true
      expect(loadingModule).toBeTruthy();

      loadingModule = null;

      done();
    });
    it('"setSecondaryLoader" and expect of set "setSecondaryLoader" state to true', (done) => {
      store.commit('module/setSecondaryLoader', true);
      // Get loading data from state
      let secondaryLoadingModule = store.state.module.secondaryLoading;

      // Expect loading data to be equal to true
      expect(secondaryLoadingModule).toBeTruthy();

      secondaryLoadingModule = null;

      done();
    });
    it('"setModuleData" with data, expect of the "module" state has been same to passed data', (done) => {
      let dataModule = {
        module: {},
        moduleId: 'edsr345',
        name: 'name',
      };

      store.commit('module/setModuleData', dataModule);

      let stateModule = store.state.module.module;
      expect(stateModule).toEqual(dataModule);

      dataModule = stateModule = null;

      done();
    });
    it('"setModuleFields", with data, expect of the "module[status]" state has setted to "draft"', (done) => {
      let dataStatus = { status: 'draft' };

      store.commit('module/setModuleFields', dataStatus);

      let stateModuleStatus = store.state.module.module.status;
      expect(stateModuleStatus).toEqual(dataStatus.status);

      dataStatus = stateModuleStatus = null;

      done();
    });
    it('"setCurrentComponent" with data, expect of the "currentComponent" state has been same to passed data', (done) => {
      store.commit('module/setModuleData', mocks.module.getModule);
      let dataSetting = {
        columnId: 0,
        componentId: 0,
      };

      store.commit('module/setCurrentComponent', dataSetting);

      let stateCurrentComponent = store.getters['module/currentComponent'];

      expect(stateCurrentComponent).toEqual(dataSetting);

      dataSetting = stateCurrentComponent = null;

      done();
    });
    it('"clearCurrentComponent", expect of the "currentComponent" state has been empty object', (done) => {
      store.commit('module/setModuleData', mocks.module.getModule);
      let dataSetting = {
        columnId: 0,
        componentId: 0,
      };

      store.commit('module/setCurrentComponent', dataSetting);
      store.commit('module/clearCurrentComponent');

      let stateCurrentComponent = store.getters['module/currentComponent'];
      expect(stateCurrentComponent).toBeEmptyObject();

      dataSetting = stateCurrentComponent = null;

      done();
    });
    it('"updateElement" with data, expect of the "module" state has been changed component data', (done) => {
      let dataElement = {
        columnId: '0',
        componentId: '0',
        data: {
          text: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>',
        },
      };
      let newStruct = {
        structure: {
          columns: [
            {
              components: [
                {
                  data: {
                    text: '',
                  },
                },
              ],
            },
          ],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/updateElement', dataElement);

      let dataModule = store.state.module.module.structure.columns[0].components[0].data;

      expect(dataModule).toEqual(dataElement.data);

      store.commit('module/setModuleData', {});

      dataElement = newStruct = dataModule = null;

      done();
    });
    it('"saveModuleProperty" with data, expect of the "module" state has been changed property data', (done) => {
      let eventData = {
        subComponent: 'image',
        link: 'style',
        property: 'borderBottomStyle',
        value: 'none',
      };
      let eventData2 = {
        subComponent: undefined,
        link: 'style',
        property: 'borderBottomStyle',
        value: 'none',
      };
      let eventData3 = {
        subComponent: undefined,
        link: undefined,
        property: 'borderBottomStyle',
        value: 'none',
      };
      let newStruct = {
        structure: {
          style: {},
          image: {
            style: {},
          },
        },
      };

      store.commit('module/setModuleData', newStruct);

      store.commit('module/saveModuleProperty', eventData);
      store.commit('module/saveModuleProperty', eventData2);
      store.commit('module/saveModuleProperty', eventData3);

      let stateModuleProperty = store.state.module.module.structure;

      expect(stateModuleProperty.image.style).toHaveProperty(eventData.property, eventData.value);
      expect(stateModuleProperty.style).toHaveProperty(eventData2.property, eventData2.value);
      expect(stateModuleProperty).toHaveProperty(eventData3.property, eventData3.value);

      store.commit('module/setModuleData', {});

      eventData = eventData2 = eventData3 = newStruct = stateModuleProperty = null;

      done();
    });
    it('"saveModule" with data, expect of the "module" state has been changed the moduleId', (done) => {
      let moduleId = '5b2c13af57ea5300113fc7b2';

      store.commit('module/saveModule', moduleId);

      let storeModuleId = store.state.module.module.moduleId;

      expect(storeModuleId).toEqual(moduleId);

      moduleId = storeModuleId = null;

      done();
    });
    it('"addColumn" with data, expect in the "modules" state has added column data', (done) => {
      let column = {
        id: 811955,
        type: 'column-element',
        container: {
          style: {},
          attribute: { width: '100%' },
          styleOption: {},
        },
        content: {
          style: {},
          attribute: {},
          styleOption: {},
        },
        components: [],
        plugins: {
          columnBackgroundColor: {
            name: 'column-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['column'],
            config: {
              defaultColors: [
                '#ffffff', '#323c44',
                '#cd263a', '#8d8d8d',
                '#9e00ff', '#0000ff',
                '#00da00', '#dada00',
                '#ff8d00', '#ff00de',
                '#a65628', '#848484',
              ],
              defaultValue: '#ffffff',
            },
            data: {},
            render: true,
            enabled: false,
          },
          verticalAligment: undefined,
        },
      };
      let newStruct = {
        structure: {
          columns: [],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/addColumn', column);

      let storeColumns = store.state.module.module.structure.columns[0];

      expect(storeColumns).toEqual(column);

      column = newStruct = storeColumns = null;

      done();
    });
    it('"removeColumns" with data, expect of the state "modules" remove column data', (done) => {
      let data = {
        index: 0,
        number: 1,
      };
      let column = {
        id: 811955,
        type: 'column-element',
        container: {
          style: {},
          attribute: { width: '100%' },
          styleOption: {},
        },
        content: {
          style: {},
          attribute: {},
          styleOption: {},
        },
        components: [],
        plugins: {
          columnBackgroundColor: {
            name: 'column-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['column'],
            config: {
              defaultColors: [
                '#ffffff', '#323c44',
                '#cd263a', '#8d8d8d',
                '#9e00ff', '#0000ff',
                '#00da00', '#dada00',
                '#ff8d00', '#ff00de',
                '#a65628', '#848484',
              ],
              defaultValue: '#ffffff',
            },
            data: {},
            render: true,
            enabled: false,
          },
          verticalAligment: undefined,
        },
      };
      let newStruct = {
        structure: {
          columns: [],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/addColumn', column);
      store.commit('module/removeColumns', data);

      let storeColumns = store.state.module.module.structure.columns;
      expect(storeColumns).toBeEmptyArray();

      store.commit('module/setModuleData', {});

      data = column = newStruct = storeColumns = null;

      done();
    });
    it('"setColumnWidth" with data, expect in the "module" state of each column width has modified with the new value', (done) => {
      let data = {
        colId: 0,
        width: 100,
      };
      let newStruct = {
        structure: {
          columns: [{
            container: {
              attribute: { width: '0%' },
            },
          }],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/setColumnWidth', data);

      let storeModuleFirstColumnWidth = store.state.module.module.structure.columns[0].container.attribute.width;

      expect(storeModuleFirstColumnWidth).toEqual(`${data.width}%`);

      store.commit('module/setModuleData', {});

      data = newStruct = storeModuleFirstColumnWidth = null;

      done();
    });
    it('"saveColumnProperty" with data, expect of the "module" state saved property data of column', (done) => {
      let data = {
        colId: 0,
        subComponent: 'container',
        link: 'attribute',
        property: 'bgcolor',
        value: '#E14444',
      };
      let data2 = {
        colId: 0,
        subComponent: undefined,
        link: 'attribute',
        property: 'bgcolor',
        value: '#E14444',
      };
      let newStruct = {
        structure: {
          columns: [{
            container: {
              attribute: { bgcolor: '#000000' },
            },
            attribute: { bgcolor: '#000000' },
          }],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/saveColumnProperty', data);
      store.commit('module/saveColumnProperty', data2);

      let storeModuleFirstColumnBgColor = store.state.module.module.structure.columns[0].container.attribute.bgcolor;
      let storeModuleFirstColumnBgColor2 = store.state.module.module.structure.columns[0].container.attribute.bgcolor;

      expect(storeModuleFirstColumnBgColor).toEqual(data.value);
      expect(storeModuleFirstColumnBgColor2).toEqual(data.value);

      store.commit('module/setModuleData', {});

      data = data2 = newStruct = storeModuleFirstColumnBgColor = storeModuleFirstColumnBgColor2 = null;

      done();
    });
    it('"addComponent" with data, expect of the state "module" has been added new component data', (done) => {
      let dataComponent = {
        el: {
          id: 731844,
          type: 'text-element',
          data: { text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.' },
          container: {
            style: {
              paddingTop: '5px',
              paddingBottom: '5px',
              paddingRight: '5px',
              paddingLeft: '5px',
            },
            styleOption: {},
            attribute: {},
          },
          text: {
            style: {
              fontFamily: 'Helvetica, Arial, Sans-serif',
              fontSize: '12px',
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: '16px',
              align: 'left',
            },
            styleOption: {},
            attribute: {},
          },
          plugins: {
            alignment: {
              name: 'alignment',
              title: 'Alignment',
              version: '0.0.1',
              author: 'emiliano@stensul.com',
              target: ['button',
                'divider',
                'image',
                'text',
              ],
              config: {
                options: ['left',
                  'center',
                  'right',
                ],
                defaultValue: 'center',
              },
              data: {},
              render: true,
              enabled: false,
            },
            backgroundColor: {
              name: 'background-color',
              title: 'Background color',
              version: '0.0.1',
              author: 'emiliano@stensul.com',
              target: ['button',
                'divider',
                'image',
                'text',
              ],
              config: {
                defaultColors: ['#ffffff',
                  '#323c44',
                  '#cd263a',
                  '#8d8d8d',
                  '#9e00ff',
                  '#0000ff',
                  '#00da00',
                  '#dada00',
                  '#ff8d00',
                  '#ff00de',
                  '#a65628',
                  '#848484',
                ],
                defaultValue: '#ffffff',
              },
              data: {},
              render: true,
              enabled: false,
            },
            mobileStyles: {
              name: 'mobile-styles',
              title: 'Mobile styles',
              version: '0.0.1',
              author: 'matias@stensul.com',
              target: ['styles',
                'button',
                'divider',
                'image',
                'text',
              ],
              config: {
                settings: {
                  hiddenMobile: {
                    value: false,
                    title: 'Hide in mobile',
                    key: 'hidden_mobile',
                    selector: 'tr',
                    _class: 'st-hide-mobile',
                  },
                  hiddenDesktop: {
                    value: false,
                    title: 'Hide in desktop',
                    key: 'hidden_desktop',
                    selector: 'tr',
                    _class: 'st-hide-desktop',
                  },
                  resetPadding: {
                    value: false,
                    title: 'Reset padding',
                    key: 'reset_padding',
                    selector: 'td:first',
                    _class: 'st-pd-0',
                  },
                },
              },
              data: {},
              render: true,
              enabled: false,
            },
            paletteBackgroundColor: {
              name: 'palette-background-color',
              title: 'Palette Background color',
              version: '0.0.1',
              author: 'matias@stensul.com',
              target: ['button',
                'divider',
                'image',
                'text',
              ],
              config: {
                options: {
                  bgcolor: {
                    label: 'Background color',
                    key: 'bgcolor',
                    value: false,
                    palette: ['000000',
                      '474646',
                      '79A8C9',
                      'CD202C',
                    ],
                    defaultValue: 'transparent',
                  },
                },
              },
              data: {},
              render: true,
              enabled: false,
            },
            textOptions: {
              name: 'text-options',
              title: 'Text Editable',
              version: '0.0.1',
              author: 'emiliano@stensul.com',
              target: ['button',
                'text',
              ],
              config: {
                options: {
                  undo: {
                    label: 'Undo',
                    key: 'undo',
                    value: false,
                    icon: 'fa fa-undo',
                  },
                  redo: {
                    label: 'Redo',
                    key: 'redo',
                    value: false,
                    icon: 'fa fa-repeat',
                  },
                  bold: {
                    label: 'Bold',
                    key: 'bold',
                    value: false,
                    icon: 'fa fa-bold',
                  },
                  italic: {
                    label: 'Italic',
                    key: 'italic',
                    value: false,
                    icon: 'fa fa-italic',
                  },
                  underline: {
                    label: 'Underline',
                    key: 'underline',
                    value: false,
                    icon: 'fa fa-underline',
                  },
                  strikethrough: {
                    label: 'Strikethrough',
                    key: 'strikethrough',
                    value: false,
                    icon: 'fa fa-strikethrough',
                  },
                  alignleft: {
                    label: 'Align left',
                    key: 'alignleft',
                    value: false,
                    icon: 'fa fa-align-left',
                  },
                  aligncenter: {
                    label: 'Align center',
                    key: 'aligncenter',
                    value: false,
                    icon: 'fa fa-align-center',
                  },
                  alignright: {
                    label: 'Align right',
                    key: 'alignright',
                    value: false,
                    icon: 'fa fa-align-right',
                  },
                  superscript: {
                    label: 'Superscript',
                    key: 'superscript',
                    value: false,
                    icon: 'fa fa-superscript',
                  },
                  fontselect: {
                    label: 'Font',
                    key: 'fontselect',
                    value: false,
                    icon: 'fa-adapter glyphicon glyphicon-font',
                  },
                  fontsizeselect: {
                    label: 'Font size',
                    key: 'fontsizeselect',
                    value: false,
                    icon: 'fa-adapter glyphicon glyphicon-text-size',
                  },
                  bullist: {
                    label: 'Bullet list',
                    key: 'bullist',
                    value: false,
                    icon: 'fa fa-list-ul',
                  },
                  numlist: {
                    label: 'Number list',
                    key: 'numlist',
                    value: false,
                    icon: 'fa fa-list-ol',
                  },
                  forecolor: {
                    label: 'Font color',
                    key: 'forecolor',
                    value: false,
                    icon: 'font-mce-ico mce-i-forecolor',
                    textcolor_map: ['000000',
                      'Black',
                      '474646',
                      'Gray',
                      '79a8c9',
                      'Blue',
                      'cd202c',
                      'Red',
                    ],
                    textcolor_from_library: false,
                    palette_name: '',
                  },
                  backcolor: {
                    label: 'Background color',
                    key: 'backcolor',
                    value: false,
                    icon: 'font-mce-ico mce-i-backcolor',
                  },
                  link: {
                    label: 'Link',
                    key: 'link',
                    value: false,
                    icon: 'fa fa-link',
                  },
                  styleselect: {
                    label: 'Style Format',
                    key: 'styleselect',
                    value: false,
                    icon: 'fa fa-edit',
                  },
                },
                settings: {
                  link_validate_url: {
                    title: 'Validate Url',
                    value: false,
                  },
                  truncate: {
                    title: 'Characters Limit',
                    value: false,
                    type: 'number',
                  },
                  lines_limit: {
                    title: 'Lines Limit',
                    value: false,
                    type: 'text',
                    content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                  },
                  fontsize_formats: {
                    title: 'Font size',
                    value: false,
                    type: 'text',
                    content: '12px 14px 16px 18px',
                  },
                  style_formats: {
                    title: 'Style format',
                    value: false,
                    type: 'text',
                    content: '[{"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},{"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},{"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}]',
                  },
                  link_fixed_color: {
                    title: 'Link fixed color',
                    value: false,
                    type: 'text',
                    content: '#514960',
                  },
                },
              },
              render: false,
              enabled: false,
            },
          },
        },
        index: 0,
        colId: '0',
      };
      let newStruct = {
        structure: {
          columns: [
            {
              components: [],
            },
          ],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/addComponent', dataComponent);

      let stateComponent = store.state.module.module.structure.columns[0].components[0];

      expect(stateComponent).toEqual(dataComponent.el);

      dataComponent = newStruct = stateComponent = null;

      done();
    });
    xit('"attachPlugins", ', () => {});
    it('"removeElement" with data, expect of the state "module" has been removed the component data', (done) => {
      let data = {
        elementId: 731844,
      };
      let dataComponent = {
        el: {
          id: 731844,
          type: 'text-element',
          data: { text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.' },
          container: {
            style: {
              paddingTop: '5px',
              paddingBottom: '5px',
              paddingRight: '5px',
              paddingLeft: '5px',
            },
            styleOption: {},
            attribute: {},
          },
          text: {
            style: {
              fontFamily: 'Helvetica, Arial, Sans-serif',
              fontSize: '12px',
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: '16px',
              align: 'left',
            },
            styleOption: {},
            attribute: {},
          },
          plugins: {
            alignment: {
              name: 'alignment',
              title: 'Alignment',
              version: '0.0.1',
              author: 'emiliano@stensul.com',
              target: ['button',
                'divider',
                'image',
                'text',
              ],
              config: {
                options: ['left',
                  'center',
                  'right',
                ],
                defaultValue: 'center',
              },
              data: {},
              render: true,
              enabled: false,
            },
            backgroundColor: {
              name: 'background-color',
              title: 'Background color',
              version: '0.0.1',
              author: 'emiliano@stensul.com',
              target: ['button',
                'divider',
                'image',
                'text',
              ],
              config: {
                defaultColors: ['#ffffff',
                  '#323c44',
                  '#cd263a',
                  '#8d8d8d',
                  '#9e00ff',
                  '#0000ff',
                  '#00da00',
                  '#dada00',
                  '#ff8d00',
                  '#ff00de',
                  '#a65628',
                  '#848484',
                ],
                defaultValue: '#ffffff',
              },
              data: {},
              render: true,
              enabled: false,
            },
            mobileStyles: {
              name: 'mobile-styles',
              title: 'Mobile styles',
              version: '0.0.1',
              author: 'matias@stensul.com',
              target: ['styles',
                'button',
                'divider',
                'image',
                'text',
              ],
              config: {
                settings: {
                  hiddenMobile: {
                    value: false,
                    title: 'Hide in mobile',
                    key: 'hidden_mobile',
                    selector: 'tr',
                    _class: 'st-hide-mobile',
                  },
                  hiddenDesktop: {
                    value: false,
                    title: 'Hide in desktop',
                    key: 'hidden_desktop',
                    selector: 'tr',
                    _class: 'st-hide-desktop',
                  },
                  resetPadding: {
                    value: false,
                    title: 'Reset padding',
                    key: 'reset_padding',
                    selector: 'td:first',
                    _class: 'st-pd-0',
                  },
                },
              },
              data: {},
              render: true,
              enabled: false,
            },
            paletteBackgroundColor: {
              name: 'palette-background-color',
              title: 'Palette Background color',
              version: '0.0.1',
              author: 'matias@stensul.com',
              target: ['button',
                'divider',
                'image',
                'text',
              ],
              config: {
                options: {
                  bgcolor: {
                    label: 'Background color',
                    key: 'bgcolor',
                    value: false,
                    palette: ['000000',
                      '474646',
                      '79A8C9',
                      'CD202C',
                    ],
                    defaultValue: 'transparent',
                  },
                },
              },
              data: {},
              render: true,
              enabled: false,
            },
            textOptions: {
              name: 'text-options',
              title: 'Text Editable',
              version: '0.0.1',
              author: 'emiliano@stensul.com',
              target: ['button',
                'text',
              ],
              config: {
                options: {
                  undo: {
                    label: 'Undo',
                    key: 'undo',
                    value: false,
                    icon: 'fa fa-undo',
                  },
                  redo: {
                    label: 'Redo',
                    key: 'redo',
                    value: false,
                    icon: 'fa fa-repeat',
                  },
                  bold: {
                    label: 'Bold',
                    key: 'bold',
                    value: false,
                    icon: 'fa fa-bold',
                  },
                  italic: {
                    label: 'Italic',
                    key: 'italic',
                    value: false,
                    icon: 'fa fa-italic',
                  },
                  underline: {
                    label: 'Underline',
                    key: 'underline',
                    value: false,
                    icon: 'fa fa-underline',
                  },
                  strikethrough: {
                    label: 'Strikethrough',
                    key: 'strikethrough',
                    value: false,
                    icon: 'fa fa-strikethrough',
                  },
                  alignleft: {
                    label: 'Align left',
                    key: 'alignleft',
                    value: false,
                    icon: 'fa fa-align-left',
                  },
                  aligncenter: {
                    label: 'Align center',
                    key: 'aligncenter',
                    value: false,
                    icon: 'fa fa-align-center',
                  },
                  alignright: {
                    label: 'Align right',
                    key: 'alignright',
                    value: false,
                    icon: 'fa fa-align-right',
                  },
                  superscript: {
                    label: 'Superscript',
                    key: 'superscript',
                    value: false,
                    icon: 'fa fa-superscript',
                  },
                  fontselect: {
                    label: 'Font',
                    key: 'fontselect',
                    value: false,
                    icon: 'fa-adapter glyphicon glyphicon-font',
                  },
                  fontsizeselect: {
                    label: 'Font size',
                    key: 'fontsizeselect',
                    value: false,
                    icon: 'fa-adapter glyphicon glyphicon-text-size',
                  },
                  bullist: {
                    label: 'Bullet list',
                    key: 'bullist',
                    value: false,
                    icon: 'fa fa-list-ul',
                  },
                  numlist: {
                    label: 'Number list',
                    key: 'numlist',
                    value: false,
                    icon: 'fa fa-list-ol',
                  },
                  forecolor: {
                    label: 'Font color',
                    key: 'forecolor',
                    value: false,
                    icon: 'font-mce-ico mce-i-forecolor',
                    textcolor_map: ['000000',
                      'Black',
                      '474646',
                      'Gray',
                      '79a8c9',
                      'Blue',
                      'cd202c',
                      'Red',
                    ],
                    textcolor_from_library: false,
                    palette_name: '',
                  },
                  backcolor: {
                    label: 'Background color',
                    key: 'backcolor',
                    value: false,
                    icon: 'font-mce-ico mce-i-backcolor',
                  },
                  link: {
                    label: 'Link',
                    key: 'link',
                    value: false,
                    icon: 'fa fa-link',
                  },
                  styleselect: {
                    label: 'Style Format',
                    key: 'styleselect',
                    value: false,
                    icon: 'fa fa-edit',
                  },
                },
                settings: {
                  link_validate_url: {
                    title: 'Validate Url',
                    value: false,
                  },
                  truncate: {
                    title: 'Characters Limit',
                    value: false,
                    type: 'number',
                  },
                  lines_limit: {
                    title: 'Lines Limit',
                    value: false,
                    type: 'text',
                    content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                  },
                  fontsize_formats: {
                    title: 'Font size',
                    value: false,
                    type: 'text',
                    content: '12px 14px 16px 18px',
                  },
                  style_formats: {
                    title: 'Style format',
                    value: false,
                    type: 'text',
                    content: '[{"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},{"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},{"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}]',
                  },
                  link_fixed_color: {
                    title: 'Link fixed color',
                    value: false,
                    type: 'text',
                    content: '#514960',
                  },
                },
              },
              render: false,
              enabled: false,
            },
          },
        },
        index: 0,
        colId: '0',
      };
      let newStruct = {
        structure: {
          columns: [
            {
              components: [],
            },
          ],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/addComponent', dataComponent);
      store.commit('module/removeElement', data);

      let stateComponent = store.state.module.module.structure.columns[0].components;

      expect(stateComponent).toBeEmptyArray();

      data = dataComponent = newStruct = stateComponent = null;

      done();
    });
    it('"savePlugin" with data, expect of the state "module" has been saved the plugin data', (done) => {
      let payload = {
        plugin: 'mobileStyles',
        columnId: 0,
        componentId: 0,
        config: {
          settings: {
            hiddenMobile: {
              value: true,
            },
          },
        },
      };
      let newStruct = {
        structure: {
          columns: [
            {
              components: [{
                plugins: {
                  mobileStyles: {
                    config: {},
                  },
                },
              }],
            },
          ],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/savePlugin', payload);

      let stateModulecolumn = store.state.module.module.structure.columns[payload.columnId];
      let componentPlugin = stateModulecolumn.components[payload.componentId].plugins[payload.plugin].config;

      expect(componentPlugin).toEqual(payload.config);

      store.commit('module/setModuleData', {});

      payload = newStruct = stateModulecolumn = componentPlugin = null;

      done();
    });
    it('"savePluginSuboption" with data, expect of the state "module" has been saved the plugin sub option data', (done) => {
      let payload = {
        plugin: 'paletteBackgroundColor',
        columnId: 0,
        componentId: 0,
        config: {
          options: {
            bgcolor: {
              palette: [
                '000000',
                '474646',
                '79A8C9',
                'CD202C',
                'CD202D',
              ],
            },
          },
        },
        subOption: 'bgcolor',
      };
      let newStruct = {
        structure: {
          columns: [{
            components: [{
              plugins: {
                paletteBackgroundColor: {
                  config: {
                    options: {
                      bgcolor: {},
                    },
                  },
                },
              },
            }],
          }],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/savePluginSuboption', payload);

      let column = store.state.module.module.structure.columns[payload.columnId];
      let pluginOptions = column.components[payload.componentId].plugins[payload.plugin].config.options;

      expect(pluginOptions[payload.subOption]).toEqual(payload.config.options.bgcolor);

      store.commit('module/setModuleData', {});

      payload = newStruct = column = pluginOptions = null;

      done();
    });
    it('"togglePlugin" with data, expect of the state "module" has been saved the plugin has enabled', (done) => {
      let data = {
        plugin: 'paletteBackgroundColor',
        columnId: 0,
        componentId: 0,
        enabled: false,
      };
      let data2 = {
        plugin: 'paletteBackgroundColor',
        columnId: 0,
        enabled: false,
      };
      let data3 = {
        plugin: 'paletteBackgroundColor',
        enabled: false,
      };
      let newStruct = {
        structure: {
          columns: [{
            components: [{
              plugins: {
                paletteBackgroundColor: {
                  config: {
                    options: {
                      bgcolor: {},
                    },
                  },
                  enabled: true,
                },
              },
            }],
            plugins: {
              paletteBackgroundColor: {
                enable: true,
              },
            },
          }],
        },
        plugins: {
          paletteBackgroundColor: {
            enable: true,
          },
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/togglePlugin', data);
      store.commit('module/togglePlugin', data2);
      store.commit('module/togglePlugin', data3);

      let stateTogglePlugin = store.state.module.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin];
      let stateTogglePlugin2 = store.state.module.module.structure.columns[data.columnId].plugins[data.plugin];
      let stateTogglePlugin3 = store.state.module.module.plugins[data.plugin];

      expect(stateTogglePlugin).toHaveProperty('enabled', false);
      expect(stateTogglePlugin2).toHaveProperty('enabled', false);
      expect(stateTogglePlugin3).toHaveProperty('enabled', false);

      store.commit('module/setModuleData', {});

      data = data2 = data3 = newStruct = stateTogglePlugin = stateTogglePlugin2 = stateTogglePlugin3 = null;

      done();
    });
    it('"saveComponentProperty" with data, expect of the state "module" has been saved the component property', (done) => {
      let data = {
        columnId: 0,
        componentId: 0,
        subComponent: 'text',
        property: 'attribute',
        value: {},
      };
      let data2 = {
        columnId: 0,
        componentId: 0,
        subComponent: 'text',
        link: 'style',
        property: 'lineHeight',
        value: '16px',
      };
      let data3 = {
        columnId: 0,
        componentId: 0,
        link: 'style',
        property: 'lineHeight',
        value: '16px',
      };
      let data4 = {
        columnId: 0,
        componentId: 0,
        property: 'attribute',
        value: {},
      };
      let newStruct = {
        structure: {
          columns: [{
            components: [{
              plugins: {
                paletteBackgroundColor: {
                  config: {
                    options: {
                      bgcolor: {},
                    },
                  },
                  enabled: true,
                },
              },
              text: {
                style: {
                  lineHeight: '16px',
                },
                attribute: {},
              },
              style: {
                lineHeight: '16px',
              },
              attribute: {},
            }],
          }],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/saveComponentProperty', data);
      store.commit('module/saveComponentProperty', data2);
      store.commit('module/saveComponentProperty', data3);
      store.commit('module/saveComponentProperty', data4);

      let stateSaveComponentProperty = store.state.module.module.structure.columns[data.columnId].components[data.componentId].text.attribute;
      let stateSaveComponentProperty2 = store.state.module.module.structure.columns[data.columnId].components[data.componentId].text.style;
      let stateSaveComponentProperty3 = store.state.module.module.structure.columns[data.columnId].components[data.componentId].style;
      let stateSaveComponentProperty4 = store.state.module.module.structure.columns[data.columnId].components[data.componentId].attribute;

      expect(stateSaveComponentProperty).toBeEmptyObject();
      expect(stateSaveComponentProperty2).toHaveProperty('lineHeight', '16px');
      expect(stateSaveComponentProperty3).toHaveProperty('lineHeight', '16px');
      expect(stateSaveComponentProperty4).toBeEmptyObject();

      store.commit('module/setModuleData', {});

      data = data2 = data3 = data4 = newStruct = stateSaveComponentProperty = stateSaveComponentProperty2 = stateSaveComponentProperty3 = stateSaveComponentProperty4 = null;

      done();
    });
    it('"setBuildingMode" with data, expect of the state "buildingMode" to equal to 0', (done) => {
      store.commit('module/setBuildingMode', 'mobile');

      let stateBuildingMode = store.state.module;

      expect(stateBuildingMode).toHaveProperty('buildingMode', 'mobile');

      stateBuildingMode = null;

      done();
    });
    xit('"setColumnsFixed" with data, expect of the state "buildingMode" to equal to 0', () => {});
    xit('"setInvertedStacking" ,expect ', () => {});
    it('"toggleRaw", expect of the state "showRaw" to equal true', (done) => {
      store.commit('module/toggleRaw');

      let stateModule = store.state.module;

      expect(stateModule).toHaveProperty('showRaw', true);

      stateModule = null;

      done();
    });
    it('"error" with dataError, expect to trigger "console error"', (done) => {
      store.commit('module/error');
      expect(console.error).toHaveBeenCalled();
      done();
    });
    it('"setListLibraries" with data, expect save data options of image has setted in library \'styleImageEditor\'', (done) => {
      let data = {
        plugin: 'styleImageEditor',
        columnId: 0,
        componentId: 0,
        response: [
          {
            _id: '5b3a897792f8ef0010137eb3',
            name: 'global',
            updated_at: '2018-07-02 16:22:15',
            created_at: '2018-07-02 16:22:15',
          },
          '',
        ],
      };
      let newStruct = {
        structure: {
          columns: [{
            components: [{
              plugins: {
                styleImageEditor: {
                  config: {
                    library: {
                      config: {
                        set_images: {
                          options: {},
                        },
                      },
                    },
                    'sie-plugin-image-overlay_image': {
                      config: {
                        overlay_gallery: {
                          config: {
                            set_images: {
                              options: {},
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            }],
          }],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.commit('module/setListLibraries', data);

      const stateImageOptions = store.state.module.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].config.library.config.set_images.options;

      expect(stateImageOptions).toEqual(data.response);

      store.commit('module/setModuleData', {});

      data = newStruct = null;

      done();
    });
  });
  describe('trigger action:', () => {
    let baseUrl = '';
    let original = () => {};
    let store = () => {};
    beforeAll(() => {
      baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
      original = console.error;
    });

    beforeEach(() => {
      console.error = jest.fn();
      store = createStore({
        strict: true,
        modules: {
          module: cloneDeep(moduleStore),
          campaign: cloneDeep(campaignStore),
        },
      });
    });

    afterEach(() => {
      console.error.mockClear();
      console.error = original;
      store = null;
    });

    afterAll(() => {
      nock.cleanAll();
      nock.restore();
      baseUrl = original = null;
    });

    it('"addColumn", expect that was added a new column', (done) => {
      let data = {
        type: 'column-element',
        container: {
          style: {},
          attribute: { width: '100%' },
          styleOption: {},
        },
        content: { style: {},
          attribute: {},
          styleOption: {},
        },
        components: [],
        plugins: {
          columnBackgroundColor: {
            name: 'column-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['column'],
            config: {
              defaultColors: ['#000000', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
              defaultValue: '#000000',
            },
            data: {},
            render: true,
            enabled: false,
          },
          verticalAlignment: {
            name: 'vertical-alignment',
            title: 'Vertical alignment',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['column'],
            config: {
              options: ['top', 'middle', 'bottom'],
              defaultValue: 'middle',
            },
            data: {},
            render: true,
            enabled: false,
          },
        },
      };
      let data2 = {
        type: 'column-element',
        container: { style: {},
          attribute: { width: '100%' },
          styleOption: {} },
        content: { style: {},
          attribute: {},
          styleOption: {} },
        components: [],
        plugins: {
          columnBackgroundColor: {
            name: 'column-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['column'],
            config: {
              defaultColors: ['#000000', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
              defaultValue: '#000000',
            },
            data: {},
            render: true,
            enabled: false,
          },
          verticalAlignment: {
            name: 'vertical-alignment',
            title: 'Vertical alignment',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['column'],
            config: {
              options: ['top', 'middle', 'bottom'],
              defaultValue: 'middle',
            },
            data: {},
            render: true,
            enabled: false,
          },
          alignment: {
            name: 'alignment',
            title: 'Alignment',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['button', 'divider', 'image', 'text'],
            config: {
              options: ['left', 'center', 'right'],
              defaultValue: 'center',
            },
            data: {},
            render: true,
            enabled: false,
          },
        },
      };

      Vue.prototype.$_app = {
        modulePlugins: data2.plugins,
      };

      let newStruct = {
        structure: {
          columns: [
          ],
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.dispatch('module/addColumn');

      let stateModuleColumn = store.state.module.module.structure.columns[0];
      expect(stateModuleColumn.id).toBeNumber();
      expect(stateModuleColumn.id.toString()).toMatch(/([0-9]*){6}/);
      expect(stateModuleColumn.type).toEqual(data.type);
      expect(stateModuleColumn.container).toEqual(data.container);
      expect(stateModuleColumn.content).toEqual(data.content);
      expect(stateModuleColumn.components).toEqual(data.components);
      expect(stateModuleColumn.plugins).toEqual(data.plugins);

      store.commit('module/setModuleData', {});

      data = data2 = newStruct = stateModuleColumn = null;

      done();
    });
    it('"normalizeColumns", expect to columns are equal in width', (done) => {
      let Columns = [
        {
          container: {
            attribute: {
              width: 0,
            },
          },
        },
        {
          container: {
            attribute: {
              width: 0,
            },
          },
        },
      ];

      let newStruct = {
        structure: {
          columns: Columns,
        },
      };

      store.commit('module/setModuleData', newStruct);
      store.dispatch('module/normalizeColumns', Columns);

      let storeModuleFirstColumnWidth = store.state.module.module.structure.columns[0].container.attribute.width;
      let storeModuleSecondColumnWidth = store.state.module.module.structure.columns[0].container.attribute.width;

      expect(storeModuleFirstColumnWidth).toEqual(`${(100 / 2)}%`);
      expect(storeModuleSecondColumnWidth).toEqual(`${(100 / 2)}%`);

      store.commit('module/setModuleData', {});

      Columns = newStruct = storeModuleFirstColumnWidth = storeModuleSecondColumnWidth = null;

      done();
    });
    it('"getModuleData" with moduleId, expect to get the module data', async (done) => {
      let moduleId = '5b3ce34792f8ef00137bb105';
      const objectModule = {
        moduleId: '5b3ce34792f8ef00137bb105',
        name: 'text',
        description: 'text',
        created_by: undefined,
        updated_by: undefined,
        created_at: '2018-07-02 16:22:15',
        updated_at: '2018-07-02 16:22:15',
        title: 'text',
        type: 'studio',
        status: 'draft',
        data: {},
        inUse: 0,
        libraries: [],
        plugins: {
          moduleBackgroundColor: {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config: {
              defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
          },
        },
        structure: {
          columnsStacking: 'normal',
          attribute: {
            bgcolor: '',
            classes: '',
            height: '',
          },
          mobileClasses: [],
          style: {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            backgroundAttachment: '',
            backgroundImage: '',
            backgroundPosition: '',
            backgroundRepeat: '',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [{
            id: 105181,
            type: 'column-element',
            container: {
              style: [],
              attribute: { width: '100%' },
              styleOption: [],
            },
            content: {
              style: [],
              attribute: [],
              styleOption: [],
            },
            components: [{
              id: 949305,
              type: 'text-element',
              data: { text: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>' },
              container: {
                style: {
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                },
                styleOption: [],
                attribute: [],
              },
              text: {
                style: {
                  fontFamily: 'Helvetica, Arial, Sans-serif',
                  fontSize: '12px',
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: '16px',
                  align: 'left',
                  letterSpacing: 'normal',
                },
                styleOption: {
                  isNormalLetterSpacing: true,
                  isCustomFontWeight: false,
                },
                attribute: [],
              },
              plugins: {
                alignment: {
                  name: 'alignment',
                  title: 'Alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button', 'divider', 'image', 'text'],
                  config: {
                    options: ['left', 'center', 'right'],
                    defaultValue: 'center',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  subComponent: 'text',
                },
                backgroundColor: {
                  name: 'background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button', 'divider', 'image', 'text'],
                  config: {
                    defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  subComponent: 'container',
                },
                mobileStyles: {
                  name: 'mobile-styles',
                  title: 'Mobile styles',
                  version: '0.0.1',
                  author: 'matias@stensul.com',
                  target: ['styles', 'button', 'divider', 'image', 'text'],
                  config: {
                    settings: {
                      hiddenMobile: {
                        value: false,
                        title: 'Hide in mobile',
                        key: 'hidden_mobile',
                        selector: 'tr',
                        _class: 'st-hide-mobile',
                      },
                      hiddenDesktop: {
                        value: false,
                        title: 'Hide in desktop',
                        key: 'hidden_desktop',
                        selector: 'tr',
                        _class: 'st-hide-desktop',
                      },
                      resetPadding: {
                        value: false,
                        title: 'Reset padding',
                        key: 'reset_padding',
                        selector: 'td:first',
                        _class: 'st-pd-0',
                      },
                    },
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                paletteBackgroundColor: {
                  name: 'palette-background-color',
                  title: 'Palette Background color',
                  version: '0.0.1',
                  author: 'matias@stensul.com',
                  target: ['button', 'divider', 'image', 'text'],
                  config: {
                    options: {
                      bgcolor: {
                        label: 'Background color',
                        key: 'bgcolor',
                        value: false,
                        palette: ['000000', '474646', '79A8C9', 'CD202C', 'CD202A'],
                        defaultValue: 'transparent',
                      },
                    },
                  },
                  data: [],
                  render: true,
                  enabled: true,
                  subComponent: 'container',
                },
                textOptions: {
                  name: 'text-options',
                  title: 'Text Editable',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button',
                    'text',
                  ],
                  config: {
                    options: {
                      undo: {
                        label: 'Undo',
                        key: 'undo',
                        value: false,
                        icon: 'fa fa-undo',
                      },
                      redo: {
                        label: 'Redo',
                        key: 'redo',
                        value: true,
                        icon: 'fa fa-repeat',
                      },
                      bold: {
                        label: 'Bold',
                        key: 'bold',
                        value: true,
                        icon: 'fa fa-bold',
                      },
                      italic: {
                        label: 'Italic',
                        key: 'italic',
                        value: false,
                        icon: 'fa fa-italic',
                      },
                      underline: {
                        label: 'Underline',
                        key: 'underline',
                        value: false,
                        icon: 'fa fa-underline',
                      },
                      strikethrough: {
                        label: 'Strikethrough',
                        key: 'strikethrough',
                        value: false,
                        icon: 'fa fa-strikethrough',
                      },
                      alignleft: {
                        label: 'Align left',
                        key: 'alignleft',
                        value: false,
                        icon: 'fa fa-align-left',
                      },
                      aligncenter: {
                        label: 'Align center',
                        key: 'aligncenter',
                        value: false,
                        icon: 'fa fa-align-center',
                      },
                      alignright: {
                        label: 'Align right',
                        key: 'alignright',
                        value: false,
                        icon: 'fa fa-align-right',
                      },
                      superscript: {
                        label: 'Superscript',
                        key: 'superscript',
                        value: false,
                        icon: 'fa fa-superscript',
                      },
                      fontselect: {
                        label: 'Font',
                        key: 'fontselect',
                        value: false,
                        icon: 'fa-adapter glyphicon glyphicon-font',
                      },
                      fontsizeselect: {
                        label: 'Font size',
                        key: 'fontsizeselect',
                        value: false,
                        icon: 'fa-adapter glyphicon glyphicon-text-size',
                      },
                      bullist: {
                        label: 'Bullet list',
                        key: 'bullist',
                        value: false,
                        icon: 'fa fa-list-ul',
                      },
                      numlist: {
                        label: 'Number list',
                        key: 'numlist',
                        value: false,
                        icon: 'fa fa-list-ol',
                      },
                      forecolor: {
                        label: 'Font color',
                        key: 'forecolor',
                        value: false,
                        icon: 'font-mce-ico mce-i-forecolor',
                        textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                        textcolor_from_library: false,
                        palette_name: '',
                      },
                      backcolor: {
                        label: 'Background color',
                        key: 'backcolor',
                        value: false,
                        icon: 'font-mce-ico mce-i-backcolor',
                      },
                      link: {
                        label: 'Link',
                        key: 'link',
                        value: false,
                        icon: 'fa fa-link',
                      },
                      styleselect: {
                        label: 'Style Format',
                        key: 'styleselect',
                        value: false,
                        icon: 'fa fa-edit',
                      },
                    },
                    settings: {
                      link_validate_url: {
                        title: 'Validate Url',
                        value: false,
                      },
                      truncate: {
                        title: 'Characters Limit',
                        value: false,
                        type: 'number',
                      },
                      lines_limit: {
                        title: 'Lines Limit',
                        value: true,
                        type: 'text',
                        content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                      },
                      fontsize_formats: {
                        title: 'Font size',
                        value: false,
                        type: 'text',
                        content: '12px 14px 16px 18px',
                      },
                      style_formats: {
                        title: 'Style format',
                        value: false,
                        type: 'text',
                        content: '[{"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},{"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},{"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}]',
                      },
                      link_fixed_color: {
                        title: 'Link fixed color',
                        value: false,
                        type: 'text',
                        dependsOn: {
                          config: 'options',
                          name: 'link',
                        },
                      },
                    },
                  },
                  render: false,
                  enabled: false,
                },
              },
            }],
            plugins: {
              columnBackgroundColor: {
                name: 'column-background-color',
                title: 'Background color',
                version: '0.0.1',
                author: 'emiliano@stensul.com',
                target: ['column'],
                config: {
                  defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
                  defaultValue: '#ffffff',
                },
                data: [],
                render: true,
                enabled: false,
              },
              verticalAlignment: {
                name: 'vertical-alignment',
                title: 'Vertical alignment',
                version: '0.0.1',
                author: 'emiliano@stensul.com',
                target: ['column'],
                config: {
                  options: ['top', 'middle', 'bottom'],
                  defaultValue: 'middle',
                },
                data: [],
                render: true,
                enabled: false,
              },
            },
          }],
        },
      };
      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(`/admin/module/edit?moduleId=${moduleId}`)
        .reply(200, mocks.module.getModule);

      await store.dispatch('module/getModuleData', moduleId);

      let stateModule = store.state.module.module;

      expect(stateModule).toEqual(objectModule);

      moduleId = stateModule = null;

      done();
    });
    it('"getModuleData" without moduleId, expect to create a new module data', async (done) => {
      const objectModule = {
        moduleId: undefined,
        name: 'Untitled module',
        title: undefined,
        description: '',
        created_by: '',
        updated_by: '',
        created_at: '',
        updated_at: '',
        type: 'studio',
        status: '',
        data: {},
        plugins: {},
        inUse: 0,
        libraries: [],
        structure: {
          columnsStacking: 'normal',
          attribute: {
            bgcolor: '',
            classes: '',
            height: '',
          },
          mobileClasses: [],
          style: {
            paddingTop: 0,
            paddingLeft: 0,
            paddingBottom: 0,
            paddingRight: 0,
            backgroundAttachment: '',
            backgroundImage: '',
            backgroundPosition: '',
            backgroundRepeat: '',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [],
        },
      };
      await store.dispatch('module/getModuleData');

      let stateModule = store.state.module.module;

      expect(stateModule).toEqual(objectModule);

      stateModule = null;

      done();
    });
    it('"getModuleData" with erroneous moduleId, expect to catch error', async (done) => {
      let moduleId = '5';
      let failResponse = {
        message: 'No query results for model [Stensul\\Models\\Module] 5',
        exception: 'Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException',
        file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php',
        line: 199,
        trace: [
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Exceptions/Handler.php',
            line: 175,
            function: 'prepareException',
            class: 'Illuminate\\Foundation\\Exceptions\\Handler',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Exceptions/Handler.php',
            line: 47,
            function: 'render',
            class: 'Illuminate\\Foundation\\Exceptions\\Handler',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 83,
            function: 'render',
            class: 'Stensul\\Exceptions\\Handler',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 32,
            function: 'handleException',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/HasPermission.php',
            line: 23,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\HasPermission',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/AdminAuthenticate.php',
            line: 49,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\AdminAuthenticate',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/fideloper/proxy/src/TrustProxies.php',
            line: 57,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Fideloper\\Proxy\\TrustProxies',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Middleware/SubstituteBindings.php',
            line: 41,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Routing\\Middleware\\SubstituteBindings',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/VerifyCsrfToken.php',
            line: 22,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\VerifyCsrfToken',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/View/Middleware/ShareErrorsFromSession.php',
            line: 49,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\View\\Middleware\\ShareErrorsFromSession',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Session/Middleware/StartSession.php',
            line: 63,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Session\\Middleware\\StartSession',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Cookie/Middleware/AddQueuedCookiesToResponse.php',
            line: 37,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Cookie/Middleware/EncryptCookies.php',
            line: 59,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Cookie\\Middleware\\EncryptCookies',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 104,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 667,
            function: 'then',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 642,
            function: 'runRouteWithinStack',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 608,
            function: 'runRoute',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 597,
            function: 'dispatchToRoute',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 176,
            function: 'dispatch',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 30,
            function: 'Illuminate\\Foundation\\Http\\{closure}',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/LoadLibraries.php',
            line: 31,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\LoadLibraries',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Middleware/CheckForMaintenanceMode.php',
            line: 51,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Foundation\\Http\\Middleware\\CheckForMaintenanceMode',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 104,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 151,
            function: 'then',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 116,
            function: 'sendRequestThroughRouter',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
          {
            file: '/usr/src/app/public/index.php',
            line: 69,
            function: 'handle',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
        ],
      };

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/admin/module/edit?moduleId=5')
        .reply(404, failResponse);

      await store.dispatch('module/getModuleData', moduleId);

      expect(console.error).toHaveBeenCalled();

      moduleId = failResponse = null;

      done();
    });
    xit('"saveModuleData" with data, expect has saved the module edition', () => {
      let moduleData = {
        moduleId: '5b3ce34792f8ef00137bb103',
        name: 'text',
        title: 'text',
        type: 'studio',
        status: 'draft',
        data: {},
        plugins: {
          moduleBackgroundColor: {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config: {
              defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
          },
        },
        structure: {
          columnsStacking: 'normal',
          attribute: {
            bgcolor: '',
            classes: '',
          },
          mobileClasses: [],
          style: {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [{
            id: 105181,
            type: 'column-element',
            container: {
              style: [],
              attribute: { width: '100%' },
              styleOption: [],
            },
            content: {
              style: [],
              attribute: [],
              styleOption: [],
            },
            components: [{
              id: 949305,
              type: 'text-element',
              data: { text: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>' },
              container: {
                style: {
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                },
                styleOption: {},
                attribute: {},
              },
              text: {
                style: {
                  fontFamily: 'Helvetica, Arial, Sans-serif',
                  fontSize: '12px',
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: '16px',
                  align: 'left',
                  letterSpacing: 'normal',
                },
                styleOption: {
                  isNormalLetterSpacing: true,
                  isCustomFontWeight: false,
                },
                attribute: {},
              },
              plugins: {
                alignment: {
                  name: 'alignment',
                  title: 'Alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button', 'divider', 'image', 'text'],
                  config: {
                    options: ['left', 'center', 'right'],
                    defaultValue: 'center',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  subComponent: 'text',
                },
                backgroundColor: {
                  name: 'background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button', 'divider', 'image', 'text'],
                  config: {
                    defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  subComponent: 'container',
                },
                mobileStyles: {
                  name: 'mobile-styles',
                  title: 'Mobile styles',
                  version: '0.0.1',
                  author: 'matias@stensul.com',
                  target: ['styles', 'button', 'divider', 'image', 'text'],
                  config: {
                    settings: {
                      hiddenMobile: {
                        value: false,
                        title: 'Hide in mobile',
                        key: 'hidden_mobile',
                        selector: 'tr',
                        _class: 'st-hide-mobile',
                      },
                      hiddenDesktop: {
                        value: false,
                        title: 'Hide in desktop',
                        key: 'hidden_desktop',
                        selector: 'tr',
                        _class: 'st-hide-desktop',
                      },
                      resetPadding: {
                        value: false,
                        title: 'Reset padding',
                        key: 'reset_padding',
                        selector: 'td:first',
                        _class: 'st-pd-0',
                      },
                    },
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                paletteBackgroundColor: {
                  name: 'palette-background-color',
                  title: 'Palette Background color',
                  version: '0.0.1',
                  author: 'matias@stensul.com',
                  target: ['button',
                    'divider',
                    'image',
                    'text',
                  ],
                  config: {
                    options: {
                      bgcolor: {
                        label: 'Background color',
                        key: 'bgcolor',
                        value: false,
                        palette: ['000000', '474646', '79A8C9', 'CD202C', 'CD202A'],
                        defaultValue: 'transparent',
                      },
                    },
                  },
                  data: [],
                  render: true,
                  enabled: true,
                  subComponent: 'container',
                },
                textOptions: {
                  name: 'text-options',
                  title: 'Text Editable',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button',
                    'text',
                  ],
                  config: {
                    options: {
                      undo: {
                        label: 'Undo',
                        key: 'undo',
                        value: false,
                        icon: 'fa fa-undo',
                      },
                      redo: {
                        label: 'Redo',
                        key: 'redo',
                        value: true,
                        icon: 'fa fa-repeat',
                      },
                      bold: {
                        label: 'Bold',
                        key: 'bold',
                        value: true,
                        icon: 'fa fa-bold',
                      },
                      italic: {
                        label: 'Italic',
                        key: 'italic',
                        value: false,
                        icon: 'fa fa-italic',
                      },
                      underline: {
                        label: 'Underline',
                        key: 'underline',
                        value: false,
                        icon: 'fa fa-underline',
                      },
                      strikethrough: {
                        label: 'Strikethrough',
                        key: 'strikethrough',
                        value: false,
                        icon: 'fa fa-strikethrough',
                      },
                      alignleft: {
                        label: 'Align left',
                        key: 'alignleft',
                        value: false,
                        icon: 'fa fa-align-left',
                      },
                      aligncenter: {
                        label: 'Align center',
                        key: 'aligncenter',
                        value: false,
                        icon: 'fa fa-align-center',
                      },
                      alignright: {
                        label: 'Align right',
                        key: 'alignright',
                        value: false,
                        icon: 'fa fa-align-right',
                      },
                      superscript: {
                        label: 'Superscript',
                        key: 'superscript',
                        value: false,
                        icon: 'fa fa-superscript',
                      },
                      fontselect: {
                        label: 'Font',
                        key: 'fontselect',
                        value: false,
                        icon: 'fa-adapter glyphicon glyphicon-font',
                      },
                      fontsizeselect: {
                        label: 'Font size',
                        key: 'fontsizeselect',
                        value: false,
                        icon: 'fa-adapter glyphicon glyphicon-text-size',
                      },
                      bullist: {
                        label: 'Bullet list',
                        key: 'bullist',
                        value: false,
                        icon: 'fa fa-list-ul',
                      },
                      numlist: {
                        label: 'Number list',
                        key: 'numlist',
                        value: false,
                        icon: 'fa fa-list-ol',
                      },
                      forecolor: {
                        label: 'Font color',
                        key: 'forecolor',
                        value: false,
                        icon: 'font-mce-ico mce-i-forecolor',
                        textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                        textcolor_from_library: false,
                        palette_name: '',
                      },
                      backcolor: {
                        label: 'Background color',
                        key: 'backcolor',
                        value: false,
                        icon: 'font-mce-ico mce-i-backcolor',
                      },
                      link: {
                        label: 'Link',
                        key: 'link',
                        value: false,
                        icon: 'fa fa-link',
                      },
                      styleselect: {
                        label: 'Style Format',
                        key: 'styleselect',
                        value: false,
                        icon: 'fa fa-edit',
                      },
                    },
                    settings: {
                      link_validate_url: {
                        title: 'Validate Url',
                        value: false,
                      },
                      truncate: {
                        title: 'Characters Limit',
                        value: false,
                        type: 'number',
                      },
                      lines_limit: {
                        title: 'Lines Limit',
                        value: true,
                        type: 'text',
                        content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                      },
                      fontsize_formats: {
                        title: 'Font size',
                        value: false,
                        type: 'text',
                        content: '12px 14px 16px 18px',
                      },
                      style_formats: {
                        title: 'Style format',
                        value: false,
                        type: 'text',
                        content: '[{"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},{"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},{"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}]',
                      },
                      link_fixed_color: {
                        title: 'Link fixed color',
                        value: false,
                        type: 'text',
                        dependsOn: {
                          config: 'options',
                          name: 'link',
                        },
                      },
                    },
                  },
                  render: false,
                  enabled: false,
                },
              },
            }],
            plugins: {
              columnBackgroundColor: {
                name: 'column-background-color',
                title: 'Background color',
                version: '0.0.1',
                author: 'emiliano@stensul.com',
                target: ['column'],
                config: {
                  defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
                  defaultValue: '#ffffff',
                },
                data: [],
                render: true,
                enabled: false,
              },
              verticalAlignment: {
                name: 'vertical-alignment',
                title: 'Vertical alignment',
                version: '0.0.1',
                author: 'emiliano@stensul.com',
                target: ['column'],
                config: {
                  options: ['top',
                    'middle',
                    'bottom',
                  ],
                  defaultValue: 'middle',
                },
                data: [],
                render: true,
                enabled: false,
              },
            },
          }],
        },
      };
      let response = { id: '5b3ce34792f8ef00137bb103', message: 'SUCCESS' };
      let newStruct = {
        moduleId: '5b3ce34792f8ef00137bb105',
      };

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/admin/module/save', moduleData)
        .reply(200, response);

      store.commit('module/setModuleData', newStruct);
      store.dispatch('module/saveModuleData', moduleData);

      let moduleId = store.state.module.module.moduleId;

      expect(moduleId).toEqual(moduleData.moduleId);

      store.commit('module/setModuleData', {});

      moduleData = response = newStruct = moduleId = null;
    });
    xit('"saveModuleData" with data, expect has saved the module edition', () => {
      let moduleData = {
        moduleId: '5b3ce34792f8ef00137bb103',
        name: 'text',
        title: 'text',
        type: 'studio',
        status: 'draft',
        data: {},
        plugins: {
          moduleBackgroundColor: {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config: {
              defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
          },
        },
        structure: {
          columnsStacking: 'normal',
          attribute: {
            bgcolor: '',
            classes: '',
          },
          mobileClasses: [],
          style: {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [{
            id: 105181,
            type: 'column-element',
            container: {
              style: [],
              attribute: { width: '100%' },
              styleOption: [],
            },
            content: {
              style: [],
              attribute: [],
              styleOption: [],
            },
            components: [{
              id: 949305,
              type: 'text-element',
              data: { text: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>' },
              container: {
                style: {
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  paddingRight: '5px',
                  paddingLeft: '5px',
                },
                styleOption: {},
                attribute: {},
              },
              text: {
                style: {
                  fontFamily: 'Helvetica, Arial, Sans-serif',
                  fontSize: '12px',
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: '16px',
                  align: 'left',
                  letterSpacing: 'normal',
                },
                styleOption: {
                  isNormalLetterSpacing: true,
                  isCustomFontWeight: false,
                },
                attribute: {},
              },
              plugins: {
                alignment: {
                  name: 'alignment',
                  title: 'Alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button', 'divider', 'image', 'text'],
                  config: {
                    options: ['left', 'center', 'right'],
                    defaultValue: 'center',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  subComponent: 'text',
                },
                backgroundColor: {
                  name: 'background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button', 'divider', 'image', 'text'],
                  config: {
                    defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  subComponent: 'container',
                },
                mobileStyles: {
                  name: 'mobile-styles',
                  title: 'Mobile styles',
                  version: '0.0.1',
                  author: 'matias@stensul.com',
                  target: ['styles', 'button', 'divider', 'image', 'text'],
                  config: {
                    settings: {
                      hiddenMobile: {
                        value: false,
                        title: 'Hide in mobile',
                        key: 'hidden_mobile',
                        selector: 'tr',
                        _class: 'st-hide-mobile',
                      },
                      hiddenDesktop: {
                        value: false,
                        title: 'Hide in desktop',
                        key: 'hidden_desktop',
                        selector: 'tr',
                        _class: 'st-hide-desktop',
                      },
                      resetPadding: {
                        value: false,
                        title: 'Reset padding',
                        key: 'reset_padding',
                        selector: 'td:first',
                        _class: 'st-pd-0',
                      },
                    },
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                paletteBackgroundColor: {
                  name: 'palette-background-color',
                  title: 'Palette Background color',
                  version: '0.0.1',
                  author: 'matias@stensul.com',
                  target: ['button',
                    'divider',
                    'image',
                    'text',
                  ],
                  config: {
                    options: {
                      bgcolor: {
                        label: 'Background color',
                        key: 'bgcolor',
                        value: false,
                        palette: ['000000', '474646', '79A8C9', 'CD202C', 'CD202A'],
                        defaultValue: 'transparent',
                      },
                    },
                  },
                  data: [],
                  render: true,
                  enabled: true,
                  subComponent: 'container',
                },
                textOptions: {
                  name: 'text-options',
                  title: 'Text Editable',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['button',
                    'text',
                  ],
                  config: {
                    options: {
                      undo: {
                        label: 'Undo',
                        key: 'undo',
                        value: false,
                        icon: 'fa fa-undo',
                      },
                      redo: {
                        label: 'Redo',
                        key: 'redo',
                        value: true,
                        icon: 'fa fa-repeat',
                      },
                      bold: {
                        label: 'Bold',
                        key: 'bold',
                        value: true,
                        icon: 'fa fa-bold',
                      },
                      italic: {
                        label: 'Italic',
                        key: 'italic',
                        value: false,
                        icon: 'fa fa-italic',
                      },
                      underline: {
                        label: 'Underline',
                        key: 'underline',
                        value: false,
                        icon: 'fa fa-underline',
                      },
                      strikethrough: {
                        label: 'Strikethrough',
                        key: 'strikethrough',
                        value: false,
                        icon: 'fa fa-strikethrough',
                      },
                      alignleft: {
                        label: 'Align left',
                        key: 'alignleft',
                        value: false,
                        icon: 'fa fa-align-left',
                      },
                      aligncenter: {
                        label: 'Align center',
                        key: 'aligncenter',
                        value: false,
                        icon: 'fa fa-align-center',
                      },
                      alignright: {
                        label: 'Align right',
                        key: 'alignright',
                        value: false,
                        icon: 'fa fa-align-right',
                      },
                      superscript: {
                        label: 'Superscript',
                        key: 'superscript',
                        value: false,
                        icon: 'fa fa-superscript',
                      },
                      fontselect: {
                        label: 'Font',
                        key: 'fontselect',
                        value: false,
                        icon: 'fa-adapter glyphicon glyphicon-font',
                      },
                      fontsizeselect: {
                        label: 'Font size',
                        key: 'fontsizeselect',
                        value: false,
                        icon: 'fa-adapter glyphicon glyphicon-text-size',
                      },
                      bullist: {
                        label: 'Bullet list',
                        key: 'bullist',
                        value: false,
                        icon: 'fa fa-list-ul',
                      },
                      numlist: {
                        label: 'Number list',
                        key: 'numlist',
                        value: false,
                        icon: 'fa fa-list-ol',
                      },
                      forecolor: {
                        label: 'Font color',
                        key: 'forecolor',
                        value: false,
                        icon: 'font-mce-ico mce-i-forecolor',
                        textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                        textcolor_from_library: false,
                        palette_name: '',
                      },
                      backcolor: {
                        label: 'Background color',
                        key: 'backcolor',
                        value: false,
                        icon: 'font-mce-ico mce-i-backcolor',
                      },
                      link: {
                        label: 'Link',
                        key: 'link',
                        value: false,
                        icon: 'fa fa-link',
                      },
                      styleselect: {
                        label: 'Style Format',
                        key: 'styleselect',
                        value: false,
                        icon: 'fa fa-edit',
                      },
                    },
                    settings: {
                      link_validate_url: {
                        title: 'Validate Url',
                        value: false,
                      },
                      truncate: {
                        title: 'Characters Limit',
                        value: false,
                        type: 'number',
                      },
                      lines_limit: {
                        title: 'Lines Limit',
                        value: true,
                        type: 'text',
                        content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                      },
                      fontsize_formats: {
                        title: 'Font size',
                        value: false,
                        type: 'text',
                        content: '12px 14px 16px 18px',
                      },
                      style_formats: {
                        title: 'Style format',
                        value: false,
                        type: 'text',
                        content: '[{"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},{"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},{"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}]',
                      },
                      link_fixed_color: {
                        title: 'Link fixed color',
                        value: false,
                        type: 'text',
                        dependsOn: {
                          config: 'options',
                          name: 'link',
                        },
                      },
                    },
                  },
                  render: false,
                  enabled: false,
                },
              },
            }],
            plugins: {
              columnBackgroundColor: {
                name: 'column-background-color',
                title: 'Background color',
                version: '0.0.1',
                author: 'emiliano@stensul.com',
                target: ['column'],
                config: {
                  defaultColors: ['#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff', '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484'],
                  defaultValue: '#ffffff',
                },
                data: [],
                render: true,
                enabled: false,
              },
              verticalAlignment: {
                name: 'vertical-alignment',
                title: 'Vertical alignment',
                version: '0.0.1',
                author: 'emiliano@stensul.com',
                target: ['column'],
                config: {
                  options: ['top',
                    'middle',
                    'bottom',
                  ],
                  defaultValue: 'middle',
                },
                data: [],
                render: true,
                enabled: false,
              },
            },
          }],
        },
      };
      let response = { id: '5b3ce34792f8ef00137bb103', message: 'SUCCESS' };
      let newStruct = {
        moduleId: '5b3ce34792f8ef00137bb105',
      };

      store.commit('module/setModuleData', newStruct);

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/admin/module/save', '')
        .reply(200, response);

      let moduleId = store.state.module.module.moduleId;

      expect(moduleId).toEqual(moduleData.moduleId);

      store.commit('module/setModuleData', {});

      moduleData = response = newStruct = moduleId = null;
    });
    it('"uploadImages" with data, have expected to save the image with format "data:[image];[base64]" and return the path', async (done) => {
      let image = 'data:image/gif;base64,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 studio-module-9fd97d284c2172c84071.js:3401:9';

      let dataImage = {
        data_image: image,
      };

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/admin/module/upload-image', dataImage)
        .reply(200, { path: '/5b4fa329654e0-1531945769.415.gif' });

      await store.dispatch('module/uploadImages', { images: [image] }).then((res) => {
        expect(res).toEqual(['/5b4fa329654e0-1531945769.415.gif']);

        dataImage = image = null;

        done();
      });
    });
    it('"uploadImages" with data without string format "data:[image];[base64]", expect to catch error', async (done) => {
      let image = '';
      let dataImage = {
        data_image: image,
      };
      let failResponse = {
        message: 'Image open  failed.',
        exception: 'Exception',
        file: '/usr/src/app/app/Services/ImageProcessor.php',
        line: 188,
        trace: [
          {
            file: '/usr/src/app/app/Services/ImageProcessor.php',
            line: 243,
            function: 'getImageObject',
            class: 'Stensul\\Services\\ImageProcessor',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Controllers/Admin/ModuleController.php',
            line: 184,
            function: 'saveImage',
            class: 'Stensul\\Services\\ImageProcessor',
            type: '->',
          },
          {
            function: 'postUploadImage',
            class: 'Stensul\\Http\\Controllers\\Admin\\ModuleController',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Controller.php',
            line: 54,
            function: 'call_user_func_array',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php',
            line: 45,
            function: 'callAction',
            class: 'Illuminate\\Routing\\Controller',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Route.php',
            line: 212,
            function: 'dispatch',
            class: 'Illuminate\\Routing\\ControllerDispatcher',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Route.php',
            line: 169,
            function: 'runController',
            class: 'Illuminate\\Routing\\Route',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 665,
            function: 'run',
            class: 'Illuminate\\Routing\\Route',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 30,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/HasPermission.php',
            line: 23,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\HasPermission',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/AdminAuthenticate.php',
            line: 49,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\AdminAuthenticate',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/fideloper/proxy/src/TrustProxies.php',
            line: 57,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Fideloper\\Proxy\\TrustProxies',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Middleware/SubstituteBindings.php',
            line: 41,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Routing\\Middleware\\SubstituteBindings',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/VerifyCsrfToken.php',
            line: 22,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\VerifyCsrfToken',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/View/Middleware/ShareErrorsFromSession.php',
            line: 49,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\View\\Middleware\\ShareErrorsFromSession',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Session/Middleware/StartSession.php',
            line: 63,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Session\\Middleware\\StartSession',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Cookie/Middleware/AddQueuedCookiesToResponse.php',
            line: 37,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Cookie/Middleware/EncryptCookies.php',
            line: 59,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Cookie\\Middleware\\EncryptCookies',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 104,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 667,
            function: 'then',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 642,
            function: 'runRouteWithinStack',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 608,
            function: 'runRoute',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 597,
            function: 'dispatchToRoute',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 176,
            function: 'dispatch',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 30,
            function: 'Illuminate\\Foundation\\Http\\{closure}',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/LoadLibraries.php',
            line: 31,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\LoadLibraries',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Middleware/CheckForMaintenanceMode.php',
            line: 51,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Foundation\\Http\\Middleware\\CheckForMaintenanceMode',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 104,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 151,
            function: 'then',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 116,
            function: 'sendRequestThroughRouter',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
          {
            file: '/usr/src/app/public/index.php',
            line: 69,
            function: 'handle',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
        ],
      };

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/admin/module/upload-image', dataImage)
        .reply(500, failResponse);

      await store.dispatch('module/uploadImages', { images: [image] }).catch((error) => {
        expect(console.error).toHaveBeenCalled();
        expect(error.status).toEqual(500);

        image = dataImage = failResponse = null;

        done();
      });
    });
    it('"uploadImages" with data image erroneous format "data:[image];[base64]", expect to catch error', async (done) => {
      let image = 'image/gif;R0lGODlhMgAyAPIEAAAAAD0+dJZkQ/nhv////wAAAAAAAAAAACH5BAAMAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAMgAyAAAD/ki6BPxAyEmnewrEi9nuUSVKnGd1kFBmY7s21ZuuYSvSN8qqpj2WNYpsUbsEfUKiSwcj7ZCxxjGJCjqmUBJy2LRkv7lqDEx2ioVlMveITS/PXnd2LXfT6+U7/qvfz3Vtfj+Agn+EMRqJiooWi46PL1OQjo2TiWFKiJaXKpsamJmVmwMbnpIYbKYDpKZsqJytAKusnlQes6yrnri0lieouLKzlry6k71VxcGPysaOukwNzcOL086Jw9HC1tzd0Ezb3uLFXETj57zl5uPHzeoe4ejc7xDY8u7R2vfK9OD7wfkCxkPXT+BAbwUDZjjoLqHBAAFiQXQICADEiwctXtyoPkEhoI0Y+YEESZEISQ3TNGrk6BHCyJANX5Zs8BJjxpoRW5rEOTHeypElf/K0J5…nxzc1BTX297dnJjOByPA3AVioaHiox4VY4smoh9o1p4oUeji6WrKSaEIqudnLNpIRWXsrasmbx+lGrAv4jEwCatvHLEd7gpxsvGilPJttHKr1G1v6rM2Ry93b8Gu9zfAAbpMtLq0t8c6eSixvHuVw/x7QZLvwX50Eem5CMXj98sf/kMrlIYY+BAhYoQPjxIbgM6hwlHSXQI5JGKOosYH76pErLgSInBXpQcqGklxpQqXVbMMadeTYcwY65UMWLOg4sfSdAsyQTDiynwggqlyeTfEpo5fuqYubQhuTcWqDwt+gINOK5VG2qtMnZJnqx6mHh90UVo2ZMjweiRCyZHgABgOQT4GeMt3Llzed69yxXA3heEQ/iNG5jI4MFZDxtOzBSAAAHSLGNe8RivXr2Qv0K+jPkl6dOYe3bGaxg04cmPNZfGeXqW69h4O8MefdM05tS6d+vGvVr27Jeyhedezbz5HNJNadduTr06bOPR66FWXr17bNSpLxq/zJ15AgA7';
      let dataImage = {
        data_image: image,
      };
      let failResponse = {
        message: 'Image open image/gif;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 failed.',
        exception: 'Exception',
        file: '/usr/src/app/app/Services/ImageProcessor.php',
        line: 188,
        trace: [
          {
            file: '/usr/src/app/app/Services/ImageProcessor.php',
            line: 243,
            function: 'getImageObject',
            class: 'Stensul\\Services\\ImageProcessor',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Controllers/Admin/ModuleController.php',
            line: 184,
            function: 'saveImage',
            class: 'Stensul\\Services\\ImageProcessor',
            type: '->',
          },
          {
            function: 'postUploadImage',
            class: 'Stensul\\Http\\Controllers\\Admin\\ModuleController',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Controller.php',
            line: 54,
            function: 'call_user_func_array',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php',
            line: 45,
            function: 'callAction',
            class: 'Illuminate\\Routing\\Controller',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Route.php',
            line: 212,
            function: 'dispatch',
            class: 'Illuminate\\Routing\\ControllerDispatcher',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Route.php',
            line: 169,
            function: 'runController',
            class: 'Illuminate\\Routing\\Route',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 665,
            function: 'run',
            class: 'Illuminate\\Routing\\Route',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 30,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/HasPermission.php',
            line: 23,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\HasPermission',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/AdminAuthenticate.php',
            line: 49,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\AdminAuthenticate',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/fideloper/proxy/src/TrustProxies.php',
            line: 57,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Fideloper\\Proxy\\TrustProxies',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Middleware/SubstituteBindings.php',
            line: 41,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Routing\\Middleware\\SubstituteBindings',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/VerifyCsrfToken.php',
            line: 22,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\VerifyCsrfToken',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/View/Middleware/ShareErrorsFromSession.php',
            line: 49,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\View\\Middleware\\ShareErrorsFromSession',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Session/Middleware/StartSession.php',
            line: 63,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Session\\Middleware\\StartSession',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Cookie/Middleware/AddQueuedCookiesToResponse.php',
            line: 37,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Cookie/Middleware/EncryptCookies.php',
            line: 59,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Cookie\\Middleware\\EncryptCookies',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 104,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 667,
            function: 'then',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 642,
            function: 'runRouteWithinStack',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 608,
            function: 'runRoute',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Router.php',
            line: 597,
            function: 'dispatchToRoute',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 176,
            function: 'dispatch',
            class: 'Illuminate\\Routing\\Router',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 30,
            function: 'Illuminate\\Foundation\\Http\\{closure}',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
          {
            file: '/usr/src/app/app/Http/Middleware/LoadLibraries.php',
            line: 31,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Stensul\\Http\\Middleware\\LoadLibraries',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Middleware/CheckForMaintenanceMode.php',
            line: 51,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 151,
            function: 'handle',
            class: 'Illuminate\\Foundation\\Http\\Middleware\\CheckForMaintenanceMode',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Pipeline.php',
            line: 53,
            function: 'Illuminate\\Pipeline\\{closure}',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php',
            line: 104,
            function: 'Illuminate\\Routing\\{closure}',
            class: 'Illuminate\\Routing\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 151,
            function: 'then',
            class: 'Illuminate\\Pipeline\\Pipeline',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php',
            line: 116,
            function: 'sendRequestThroughRouter',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
          {
            file: '/usr/src/app/public/index.php',
            line: 69,
            function: 'handle',
            class: 'Illuminate\\Foundation\\Http\\Kernel',
            type: '->',
          },
        ],
      };

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/admin/module/upload-image', dataImage)
        .reply(500, failResponse);

      await store.dispatch('module/uploadImages', { images: [image] }).catch((error) => {
        expect(console.error).toHaveBeenCalled();
        expect(error.status).toEqual(500);

        image = dataImage = failResponse = null;

        done();
      });
    });
    it('"getLibraries" with data, expect to execute \'setListLibraries\' mutation and save the info of plugins of the library', async (done) => {
      let setDataMock = jest.fn();
      let data = {
        plugin: 'styleImageEditor',
        columnId: 0,
        componentId: 2,
      };
      let requestResponse = {
        current_page: 1,
        data: [{
          _id: '5b3a897792f8ef0010137eb3',
          name: 'global',
          updated_at: '2018-07-02 16:22:15',
          created_at: '2018-07-02 16:22:15',
        }],
        first_page_url: 'http://localhost:3000/package/api/library?page=1',
        from: 1,
        last_page: 1,
        last_page_url: 'http://localhost:3000/package/api/library?page=1',
        next_page_url: null,
        path: 'http://localhost:3000/package/api/library',
        per_page: 100,
        prev_page_url: null,
        to: 1,
        total: 1,
      };
      let newStruct = {
        structure: {
          columns: [{
            components: [{
              plugins: {
                styleImageEditor: {
                  config: {
                    library: {
                      config: {
                        set_images: {
                          options: {},
                        },
                      },
                    },
                  },
                },
              },
            }],
          }],
        },
      };
      let storeModule = cloneDeep(moduleStore);
      const modStore = createStore({
        state: storeModule.state,
        getters: storeModule.getters,
        mutations: {
          ...storeModule.mutations,
          setListLibraries: setDataMock,
        },
        actions: storeModule.actions,
      });

      modStore.commit('setModuleData', newStruct);

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/package/api/library')
        .reply(200, requestResponse);

      await modStore.dispatch('getLibraries', data).then(() => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][1]).toEqual({
          plugin: 'styleImageEditor',
          columnId: 0,
          componentId: 2,
          response: [
            {
              _id: '5b3a897792f8ef0010137eb3',
              name: 'global',
              updated_at: '2018-07-02 16:22:15',
              created_at: '2018-07-02 16:22:15',
            },
            '',
          ],
        });

        modStore.commit('setModuleData', {});

        setDataMock = data = requestResponse = newStruct = storeModule = null;

        done();
      });
    });
  });
  describe('trigger getter:', () => {
    let store = () => {};
    beforeEach(() => {
      store = createStore({
        strict: true,
        modules: {
          module: cloneDeep(moduleStore),
          campaign: cloneDeep(campaignStore),
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
    it('"currentComponent", expect state module has object', (done) => {
      store.commit('module/setModuleData', mocks.module.getModule);
      let dataSetting = {
        columnId: 0,
        componentId: 0,
      };

      store.commit('module/setCurrentComponent', dataSetting);

      let getDataCurrentComponent = store.getters['module/currentComponent'];

      expect(getDataCurrentComponent).toEqual(dataSetting);

      dataSetting = getDataCurrentComponent = null;

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
});

