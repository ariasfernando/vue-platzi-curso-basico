let elements = {
    'column': require('./column'),
    'text-element': require('./textElement'),
    'image-element': require('./imageElement'),
    'button-element': require('./buttonElement'),
    'divider-element': require('./dividerElement')
  };

export const defaultElements = function(type) {
  return elements[type];
};