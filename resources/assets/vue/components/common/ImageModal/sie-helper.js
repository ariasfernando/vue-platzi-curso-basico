function transform(params) {
  const transformedOptions = {};
  transformedOptions.preset = [];
  const keys = Object.keys(params);

  const plugins = keys.filter(key => {
    const kp = key.split('_');
    if (kp.length === 1) {
      return false;
    }
    const count = keys.filter(k => k.includes(kp[0])).length;
    return key.includes('sie-plugin') && (params[key] || count > 1);
  });
  const core = keys.filter(key => key.includes('sie-') && !key.includes('sie-plugin'));

  core.forEach((key) => {
    const k = key.replace('sie-', '');
    transformedOptions[k] = {};
    Object.keys(params[key]).forEach((itemkey) => {
      const item = params[key][itemkey];
      transformedOptions[k][item.key] = item.value;
    });
  });

  plugins.forEach((pkey) => {
    const opts = params[pkey];
    const pluginParts = pkey.split('_');
    const layerPropsKeys = Object.keys(opts).filter(opt => ['description', 'visible'].includes(opts[opt].key));
    const layer = {
      type: pluginParts[0],
      options: {
        plugin: {
        },
        layer: {
          description: '',
          visible: true,
        },
      },
    };

    layerPropsKeys.forEach((key) => {
      const prop = opts[key];
      layer.options.layer[prop.key] = prop.value;
      delete opts[key];
    });

    const plugin = {};

    if (!opts) {
      plugin.enable = false;
      layer.options.plugin[pluginParts[1]] = plugin;
    }

    Object.keys(opts).forEach((optsKey) => {
      const item = opts[optsKey];
      if (!item.key.includes('_')) {
        plugin[item.key] = item.value;
        layer.options.plugin[pluginParts[1]] = plugin;
      } else {
        const itemKeys = item.key.split('_');
        layer.options.plugin[itemKeys[0]] = layer.options.plugin[itemKeys[0]] || {};
        if (item.value) {
          const tconfig = {
            enable: true,
          };

          Object.keys(item.config).forEach((configKey) => {
            const config = item.config[configKey];
            tconfig[config.key] = config.value;
          });

          layer.options.plugin[itemKeys[0]][itemKeys[1]] = tconfig;
        } else {
          layer.options.plugin[itemKeys[0]][itemKeys[1]] = {
            enable: false,
          };
        }
      }
    });

    const eLayer = transformedOptions.preset.find(layer => layer.type === pluginParts[0]);
    if (eLayer) {
      const p = {};
      Object.assign(p, eLayer.options.plugin, layer.options.plugin);
      const n = transformedOptions.preset.indexOf(eLayer);
      layer.options.plugin = p;
      transformedOptions.preset.splice(n, 1);
    }

    transformedOptions.preset.push(layer);
  });

  return transformedOptions;
}

function getObjectKeys(data, prefix = '') {
  return Object.keys(data).reduce((result, element) => {
    if (Array.isArray(data[element])) {
      return result;
    } else if (
      data[element] !== null &&
      typeof data[element] === 'object'
    ) {
      return [
        ...result,
        ...getObjectKeys(
          data[element],
          `${prefix}${element}.`,
        ),
      ];
    }
    return [...result, prefix + element];
  }, []);
}

function completeUrlPath(urlPath, ref) {
  const data = JSON.parse(JSON.stringify(ref));
  return data.reduce((res, elem) => {
    let subelem = elem;
    const urlKeys = getObjectKeys(elem)
      .filter(
        key => key.includes('url'));
    urlKeys.forEach((keys) => {
      const splitKeys = keys.split('.');
      splitKeys.forEach((key) => {
        if (splitKeys.indexOf(key) === splitKeys.length - 1 && subelem[key] !== '') {
          let url = subelem[key];
          url = url.replace('/images/', '');
          url = urlPath + url;
          subelem[key] = url;
        } else {
          subelem = subelem[key];
        }
      });
    });
    return [...res, elem];
  }, []);
}

function removeUrlPath(urlPath, ref) {
  const data = JSON.parse(JSON.stringify(ref));
  return data.reduce((res, elem) => {
    let subelem = elem;
    const urlKeys = getObjectKeys(elem)
      .filter(
        key => key.includes('url'));
    urlKeys.forEach((keys) => {
      const splitKeys = keys.split('.');
      splitKeys.forEach((key) => {
        if (splitKeys.indexOf(key) === splitKeys.length - 1 && subelem[key].includes('http')) {
          const url = subelem[key].replace(urlPath, '');
          subelem[key] = url;
        } else {
          subelem = subelem[key];
        }
      });
    });
    return [...res, elem];
  }, []);
}

function searchImage(data, keys) {
  let subData = data;
  keys.forEach((key) => {
    subData = subData[key];
  });
  return subData;
}

function isDataUrl(url) {
  const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  return !!RegExp(regex).test(url);
}

function searchStateImages(data) {
  const urlKeys = getObjectKeys(data.preset).filter((key) => key.includes('url'));
  const images = [];
  urlKeys.forEach((url) => {
    const keys = url.split('.');
    const img = searchImage(data.preset, keys);
    // I only want to upload images that are base64
    if (typeof img !== 'undefined' && img !== '' && isDataUrl(img)) {
      images.push({
        key: url,
        image: img,
      });
    }
  });
  return images;
}

export default {
  transform,
  completeUrlPath,
  removeUrlPath,
  searchStateImages,
};
