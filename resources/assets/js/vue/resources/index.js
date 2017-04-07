import column from './column'
import textElement from './textElement'
import imageElement from './imageElement'
import buttonElement from './buttonElement'
import dividerElement from './dividerElement'

export const defaultElements = function(type) {
  let elements = {
    'column': column,
    'text-element': textElement,
    'image-element': imageElement,
    'button-element': buttonElement,
    'divider-element': dividerElement
  };

  return elements[type];
};