import {
  columnBackgroundColor,
  columnPaletteBackgroundColor,
  textColorByBackground,
  verticalAlignment,
} from '../plugins/modules';
import { image0 } from '../elements';

export default {
  id: 987650,
  type: 'column-element',
  container: {
    style: [],
    attribute: {
      width: '50%',
    },
    styleOption: {
      isPxWidth: false,
    },
  },
  content: {
    style: [],
    attribute: [],
    styleOption: [],
  },
  components: [
    image0,
  ],
  plugins: {
    columnBackgroundColor,
    columnPaletteBackgroundColor,
    textColorByBackground,
    verticalAlignment,
  },
};
