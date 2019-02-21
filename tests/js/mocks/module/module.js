import {
  backgroundStyleImageEditor,
  moduleBackgroundColor,
  moduleEqualHeightForColumn,
  moduleEqualHeightForElements,
  moduleHeightSync,
  modulePaletteBackgroundColor,
  textColorByBackgroundForModule,
  toggleElement,
} from '../plugins/modules';

const {
  row0,
  row1,
} = require('../rows');

module.exports = {
  libraries: [],
  moduleId: '5c6624473fbf4700142460db',
  name: 'row',
  description: '',
  created_by: 'f@f.com',
  updated_by: 'f@f.com',
  created_at: '2019-02-14 21:30:31',
  updated_at: '2019-02-16 10:06:26',
  title: 'row',
  type: 'studio',
  status: 'draft',
  data: {},
  inUse: 0,
  plugins: {
    backgroundStyleImageEditor,
    moduleBackgroundColor,
    moduleEqualHeightForColumn,
    moduleEqualHeightForElements,
    moduleHeightSync,
    modulePaletteBackgroundColor,
    textColorByBackgroundForModule,
    toggleElement,
  },
  structure: {
    columnsStacking: 'normal',
    attribute: {
    },
    mobileClasses: [],
    style: {},
    rows: [row0, row1],
  },
};
