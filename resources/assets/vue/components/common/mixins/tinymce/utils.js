const isList = (node) => {
  if (node) {
    return ['UL', 'OL'].includes(node.nodeName);
  }
  return false;
};
const isListItem = (node) => {
  if (node) {
    return ['LI'].includes(node.nodeName);
  }
  return false;
};
const isParagraph = (node) => {
  if (node) {
    return ['P'].includes(node.nodeName);
  }
  return false;
};
const isTextElement = (node) => {
  if (node) {
    return ['P', 'SPAN'].includes(node.nodeName);
  }
  return false;
};
const isOnlyChild = (node) => {
  if (node) {
    return node.parentElement.childNodes.length === 1;
  }
  return false;
};
const getSelectionType = (editor) => {
  const body = editor.getBody();
  const bodyText = body.innerText.replace(/\s/g, '');
  const selectionText = editor.selection.getContent({ format: 'text' }).replace(/\s/g, '');
  if (selectionText === bodyText) {
    return 'all';
  }
  // 2. check if is selection is a block element
  const block = editor.dom.getParent(editor.selection.getStart(), 'P, LI');
  const blockText = block ? block.innerText.replace(/\s/g, '') : null;
  const blockSelectionText = editor.selection.getContent({ format: 'text' }).replace(/\s/g, '');
  if (blockSelectionText === blockText) {
    return 'block';
  } else if (editor.selection.isCollapsed() || editor.selection.getContent({ format: 'text' }).replace(/\s/g, '') === '') {
    return 'empty';
  }
  return 'inline';
};

const getCssObj = (style) => {
  if (!style) return false;
  if (_.isObject(style)) {
    return style;
  } else if (Application.utils.isJsonObjectString(style)) {
    return JSON.parse(style);
  }
  return Application.utils.cssToObj(style);
};

const getCssText = (style) => {
  if (!style) return false;
  if (_.isObject(style)) {
    return Application.utils.objToCss(style);
  } else if (Application.utils.isJsonObjectString(style)) {
    return Application.utils.objToCss(JSON.parse(style));
  }
  return style;
};

const setCssStyle = (el, style) => {
  if (_.isEmpty(style)) return false;
  const styleObj = {
    ...getCssObj(el.style.cssText),
    ..._.mapKeys(getCssObj(style), (v, k) => _.kebabCase(k)),
  };
  const cssText = getCssText(styleObj);
  el.setAttribute('data-mce-style', cssText);
  el.style.cssText = cssText;
  return cssText;
};

const utils = {
  isList,
  isListItem,
  isParagraph,
  isTextElement,
  isOnlyChild,
  getSelectionType,
  getCssObj,
  getCssText,
  setCssStyle,
};

export default utils;
