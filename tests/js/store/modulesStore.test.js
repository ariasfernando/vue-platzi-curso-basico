/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint max-len: 0 */

/* vendor import */
import 'expect-more-jest';
/* local import */
import store from 'store';


describe('== Module Store ==', () => {
  describe('trigger muttation:', () => {
    it('"setLoader" and set state loading to true', (done) => {
      store.commit('module/setLoader', true);
      // Get loading data from state
      let loadingModule = store.state.module.loading;

      // Expect loading data to be equal to true
      expect(loadingModule).toBeTruthy();

      loadingModule = null;

      done();
    });
    it('"setSecondaryLoader" and set state setSecondaryLoader to true', (done) => {
      store.commit('module/setSecondaryLoader', true);
      // Get loading data from state
      let secondaryLoadingModule = store.state.module.secondaryLoading;

      // Expect loading data to be equal to true
      expect(secondaryLoadingModule).toBeTruthy();

      secondaryLoadingModule = null;

      done();
    });
    it('"setModuleData" with data, expect of the state "module" has been same to passed data', (done) => {
      let dataModule = {
        module: {},
        moduleId: 'edsr345',
        name: 'name',
      };

      store.commit('module/setModuleData', dataModule);

      let stateModule = store.state.module.module;
      expect(stateModule).toEqual(dataModule);

      dataModule = null;
      stateModule = null;

      done();
    });
    it('"setModuleFields", with data, expect of the state "module[status]" has setted to "draft"', (done) => {
      let dataStatus = { status: 'draft' };

      store.commit('module/setModuleFields', dataStatus);

      let stateModuleStatus = store.state.module.module.status;
      expect(stateModuleStatus).toEqual(dataStatus.status);
      
      dataStatus = null; 
      stateModuleStatus = null;

      done();
    });
    xit('"setChangeSettingComponent" with data, expect of the state "changeSettingComponent" has been same to passed data', (done) => {
      let dataSetting = { 
        style: {
          paddingBottom: '0px',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '20px',
        },
        attribute: {
          bgColor: '#E02A2A',
        }, 
      };

      store.commit('module/setChangeSettingComponent', dataSetting);

      let stateModuleChangeSettingComponent = store.state.module.changeSettingComponent;
      expect(stateModuleChangeSettingComponent).toEqual(dataSetting);

      dataSetting = null; 
      stateModuleChangeSettingComponent = null;

      done();
    });
    it('"setCurrentComponent" with data, expect of the state "currentComponent" has been same to passed data', (done) => {
      let dataSetting = {
        columnId: 0,
        componentId: 0,
      };

      store.commit('module/setCurrentComponent', dataSetting);

      let stateCurrentComponent = store.state.module.currentComponent;
      
      expect(stateCurrentComponent).toEqual(dataSetting);
      
      dataSetting = null;
      stateCurrentComponent = null;
      
      done();
    });
    it('"clearCurrentComponent", expect of the state "currentComponent" has been empty object', (done) => {
      store.commit('module/clearCurrentComponent');

      let stateCurrentComponent = store.state.module.currentComponent;
      expect(stateCurrentComponent).toBeEmptyObject();

      stateCurrentComponent = null;

      done();
    });
    it('"updateElement" with data, expect of the state "module" has been changed component data', (done) => {
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

      dataElement = null;
      newStruct = null;
      dataModule = null;

      done();
    });
    it('"saveModuleProperty" with data, expect of the state "module" has been changed property data', (done) => {
      let eventData = {
        subComponent: undefined,
        link: 'style',
        property: 'borderBottomStyle',
        value: 'none',
      };
      let eventData2 = {
        subComponent: 'image',
        link: 'style',
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

      let stateModuleProperty = store.state.module.module.structure.style;
      let stateModuleProperty2 = store.state.module.module.structure.image.style;

      expect(stateModuleProperty).toHaveProperty(eventData.property, eventData.value);
      expect(stateModuleProperty2).toHaveProperty(eventData.property, eventData.value);

      store.commit('module/setModuleData', {});

      eventData = null;
      eventData2 = null;
      newStruct = null;
      stateModuleProperty = null;
      stateModuleProperty2 = null;

      done();
    });
    it('"saveModule" with data, expect of the state "module" has been changed the moduleId', (done) => {
      let moduleId = '5b2c13af57ea5300113fc7b2';

      store.commit('module/saveModule', moduleId);

      let storeModuleId = store.state.module.module.moduleId;

      expect(storeModuleId).toEqual(moduleId);

      moduleId = null;
      storeModuleId = null;

      done();
    });
    it('"addColumn" with data, expect of the state "modules" added column data', (done) => {
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

      column = null;
      newStruct = null;
      storeColumns = null;

      done();
    });
    it('"addColumn" with data, expect of the state "modules" remove column data', (done) => {
      let data = {
        index: 0,
        number: 1,
      };

      store.commit('module/removeColumns', data);

      let storeColumns = store.state.module.module.structure.columns;
      expect(storeColumns).toBeEmptyArray();

      store.commit('module/setModuleData', {});

      data = null;
      storeColumns = null;

      done();
    });
    xit('"addComponent" with data, expect of the state "module" has been added new component data', (done) => {
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
              name: 'pallete-background-color',
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
      
      dataComponent = null;
      newStruct = null;
      stateComponent = null;
      
      done();
    });
  });
});
