/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-env node, jest, es6 */

const {
  cloneDeep,
  nock,
  Vue,
  mocks,
  moduleService,
  moduleStore,
  createStore,
} = require('./config.js');

let moduleState = {};

// const testMockImageServiceResolved = () => {
//   imageService = jest.fn().mockResolvedValue();
// }
// const testMockImageServiceRejected = () => {
//   imageService = jest.fn().mockRejectedValue();
// };
const mockModServiceResolve = (optionMock) => {
  moduleService[optionMock.method] = jest.fn().mockResolvedValue(optionMock.resolveWith);
};
const mockModServiceRestore = (optionMock) => {
  moduleService[optionMock.method].mockReset();
};
const mockMutation = (mutationToMock) => {
  const mutationstoMock = {};
  const setDataMock = [];
  for (let index = 0; index < mutationToMock.length; index++) {
    setDataMock[index] = jest.fn();
    mutationstoMock[mutationToMock[index]] = setDataMock[index];
  }

  const storeModule = cloneDeep(moduleStore);

  const modStore = createStore({
    state: {
      ...storeModule.state,
      module: mocks.module,
    },
    getters: storeModule.getters,
    mutations: {
      ...storeModule.mutations,
      ...mutationstoMock,
    },
    actions: storeModule.actions,
  });

  return {
    modStore,
    setDataMock,
  };
};


describe('trigger action:', () => {
  let baseUrl = '';
  let original = () => {};
  let store = () => {};
  let mockRow = {};
  beforeAll(() => {
    baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
    original = console.error;
    store = createStore({
      strict: true,
      modules: {
        module: cloneDeep(moduleStore),
      },
    });
  });

  beforeEach(() => {
    Vue.prototype.$_app = {
      modulePlugins: {},
    };
    mockRow = mocks.row0;
    console.error = jest.fn();
    store.commit('module/setModuleData', cloneDeep(mocks.module));
    moduleState = store.state.module;
    jest.mock('@/models/Element');
  });

  afterEach(() => {
    Vue.prototype.$_app = {};
    console.error.mockClear();
    console.error = original;
    moduleState = mockRow = null;
    jest.restoreAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.restore();
    baseUrl = original = null;
  });
  it('"addRow", expect that was added a new row', (done) => {
    let { modStore, setDataMock } = mockMutation(['addRow']);

    modStore.dispatch('addRow');

    expect(setDataMock[0].mock.calls.length).toEqual(1);
    expect(setDataMock[0].mock.calls[0][0]).toBeObject();
    expect(setDataMock[0].mock.calls[0][1]).toEqual({ row: mockRow });

    setDataMock = modStore = null;

    done();
  });
  it('"addColumn", expect that was added a new column', (done) => {
    let { modStore, setDataMock } = mockMutation(['addColumn']);

    modStore.dispatch('addColumn', { rowId: mockRow.id });

    expect(setDataMock[0].mock.calls.length).toEqual(1);
    expect(setDataMock[0].mock.calls[0][0]).toBeObject();
    expect(setDataMock[0].mock.calls[0][1]).toEqual({ column: mocks.column1, rowId: mockRow.id });

    modStore = setDataMock = null;

    done();
  });
  it('"normalizeColumns", expect to columns are equal in width', (done) => {
    let { modStore, setDataMock } = mockMutation(['saveElementProperty']);

    modStore.dispatch('normalizeColumns', { rowId: mocks.row1.id });

    expect(setDataMock[0].mock.calls.length).toEqual(4);
    for (let index = 0; index < setDataMock[0].mock.calls.length; index++) {
      expect(setDataMock[0].mock.calls[index][0]).toBeObject();
      expect(setDataMock[0].mock.calls[index][1]).toEqual({
        elementId: mocks.row1.columns[index].id,
        subComponent: 'container',
        link: 'attribute',
        property: 'width',
        value: `${100 / mocks.row1.columns.length}%`,
      });
    }

    modStore = setDataMock = null;

    done();
  });
  it('"getModuleData" with moduleId, expect to get the module data', (done) => {
    let response = {
      ...mocks.module,
      _id: mocks.module.moduleId,
      created_by: { email: mocks.module.created_by },
      updated_by: { email: mocks.module.updated_by },
    };
    delete response.moduleId;

    let { modStore, setDataMock } = mockMutation(['setModuleData']);
    mockModServiceResolve({
      method: 'getModule',
      resolveWith: response,
    });

    modStore.dispatch('getModuleData', mocks.module.moduleId).then(() => {
      expect(moduleService.getModule.mock.calls.length).toEqual(1);
      expect(moduleService.getModule.mock.calls[0][0]).toEqual(mocks.module.moduleId);
      expect(setDataMock[0].mock.calls.length).toEqual(1);
      expect(setDataMock[0].mock.calls[0][0]).toBeObject();
      expect(setDataMock[0].mock.calls[0][1]).toEqual(response);

      modStore = setDataMock = response = null;
      mockModServiceRestore({
        method: 'getModule',
      });
      done();
    });
  });
  it('"getModuleData" without moduleId, expect to create a new module data', (done) => {
    let { modStore, setDataMock } = mockMutation(['setModuleData']);
    mockModServiceResolve({
      method: 'newModule',
      resolveWith: mocks.newModule,
    });

    modStore.dispatch('getModuleData').then(() => {
      expect(moduleService.newModule.mock.calls.length).toEqual(1);
      expect(moduleService.newModule.mock.calls[0][0]).toEqual(undefined);
      expect(setDataMock[0].mock.calls.length).toEqual(1);
      expect(setDataMock[0].mock.calls[0][0]).toBeObject();
      expect(setDataMock[0].mock.calls[0][1]).toEqual(mocks.newModule);

      setDataMock = modStore = null;
      mockModServiceRestore({
        method: 'newModule',
      });
      done();
    });
  });
  it('"saveModuleData" with data, expect has saved the module edition', () => {
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
      moduleId: '5b3ce34792f8ef00137bb103',
    };

    nock(baseUrl)
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .post('/admin/module/save', moduleData)
      .reply(200, response);

    store.commit('module/setModuleData', newStruct);
    store.dispatch('module/saveModuleData', moduleData);

    let moduleId = moduleState.module.moduleId;

    expect(moduleId).toEqual(moduleData.moduleId);

    store.commit('module/setModuleData', {});

    moduleData = response = newStruct = moduleId = null;
  });
  it('"saveModuleData" with data, expect has saved the module edition', () => {
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
      moduleId: '5b3ce34792f8ef00137bb103',
    };

    store.commit('module/setModuleData', newStruct);

    nock(baseUrl)
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .post('/admin/module/save', '')
      .reply(200, response);

    let moduleId = moduleState.module.moduleId;

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
