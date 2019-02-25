import campaign from './campaign/index';
import columns from './columns/index';
import elements from './elements/index';
import library from './library/index';
import module from './module/index';
import plugins from './plugins/index';
import rows from './rows/index';


export default {
  campaign,
  ...columns,
  ...elements,
  library,
  ...module,
  plugins,
  ...rows,
};
