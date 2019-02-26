import ColumnElement from './ColumnElement';
export default {
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
  columns: [
    {
      ...ColumnElement,
      id: Math.floor(100000 + (Math.random() * 900000)),
   }
  ],
  plugins: {},
};
