import ColumnElement from './ColumnElement';
function rowDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'row-element',
    columnsStacking: 'normal',
    mobileClasses: [],
    container: {
      style: {},
      attribute: {
        width: '100%',
      },
      styleOption: {},
    },
    content: {
      style: {},
      attribute: {},
      styleOption: {},
    },
    columns: [
      {...ColumnElement()}
    ],
    plugins: {},
  };
}

module.exports = rowDefault;
