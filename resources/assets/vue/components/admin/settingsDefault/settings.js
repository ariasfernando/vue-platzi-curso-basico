export function alt() {
  return {
    name: 'alt',
    aclName: 'url_alt',
    type: 'generic-text',
    label: 'Alternative Text',
    link: 'attribute',
    value: 'Image',
    subComponent: 'image',
  };
}

export function bgcolor(props) {
  const { subComponent, aclName, label } = props || {};
  return {
    name: 'bgcolor',
    aclName: aclName || 'background_bgcolor',
    type: 'generic-color',
    link: 'attribute',
    label: label || 'Background Color',
    subComponent,
  };
}

export function borderGroup(props) {
  const { subComponent } = props || {};
  return {
    name: 'border-group',
    aclName: 'border_border-group',
    type: 'border-group',
    subComponent,
  };
}

export function borderRadius(props) {
  const { subComponent } = props || {};
  return {
    name: 'borderRadius',
    aclName: 'style_border-radius',
    type: 'generic-number',
    label: 'Border radius',
    link: 'style',
    subComponent,
  };
}

export function classes(props) {
  const { subComponent, aclName } = props || {};
  return {
    name: 'classes',
    aclName: aclName || 'style_classes',
    type: 'class-input',
    link: 'attribute',
    subComponent,
  };
}

export function color(props) {
  const { subComponent, aclName, label } = props || {};
  return {
    name: 'color',
    aclName: aclName || 'style_generic-color',
    type: 'generic-color',
    label: label || 'Text Color',
    link: 'style',
    subComponent,
  };
}

export function columnsStacking() {
  return {
    name: 'columnsStacking',
    aclName: 'stacking_column-stacking',
    type: 'columns-stacking',
    dependOn: 'hasMoreThanOneColumn',
  };
}

export function fontFamily(props) {
  const { subComponent } = props || {};
  return {
    name: 'fontFamily',
    aclName: 'font_font-family',
    type: 'font-family',
    label: 'Font Family',
    link: 'style',
    subComponent,
  };
}

export function fontSize(props) {
  const { subComponent } = props || {};
  return {
    name: 'fontSize',
    aclName: 'font_font-style',
    type: 'generic-number',
    label: 'Font size (px)',
    link: 'style',
    isPixel: true,
    subComponent,
  };
}

export function fontWeight(props) {
  const { subComponent } = props || {};
  return {
    name: 'fontWeight',
    aclName: 'font_font-weight',
    type: 'font-weight',
    subComponent,
  };
}

export function height(props) {
  const { subComponent, aclName, label, link,
    isPixel, isPercentage, minValue, value } = props || {};
  return {
    name: 'height',
    aclName: aclName || 'style_height',
    type: 'generic-number',
    label: label || 'Height (px)',
    link: link || 'attribute',
    minValue,
    isPixel,
    isPercentage,
    subComponent,
    value,
  };
}

export function href(props) {
  const { subComponent, aclName } = props || {};
  return {
    name: 'href',
    aclName: aclName || 'url_href',
    type: 'generic-text',
    label: 'Default URL',
    link: 'attribute',
    subComponent,
    value: '',
  };
}

export function imageSize() {
  return {
    name: 'image-size',
    aclName: 'image_image-size',
    type: 'image-size',
    subComponent: 'image',
  };
}

export function letterSpacing(props) {
  const { subComponent } = props || {};
  return {
    name: 'letterSpacing',
    aclName: 'font_letter-spacing',
    type: 'letter-spacing',
    label: 'Letter Spacing',
    link: 'style',
    checkbox: true,
    subComponent,
  };
}

export function lineHeight(props) {
  const { subComponent } = props || {};
  return {
    name: 'lineHeight',
    aclName: 'font_font-style',
    type: 'generic-number',
    label: 'Line height (%)',
    link: 'style',
    isPercentage: true,
    maxPercentage: 200,
    subComponent,
  };
}

export function padding(props) {
  const { subComponent, aclName, label, noLabel, type } = props || {};
  return {
    name: 'padding',
    aclName: aclName || 'style_padding',
    type: type || 'padding-group',
    label: label || 'Element (px)',
    noLabel,
    subComponent,
  };
}

export function placeholder() {
  return {
    name: 'placeholder',
    aclName: 'placeholder_placeholder-desktop',
    type: 'generic-file',
    label: 'Upload Desktop',
    link: 'attribute',
    subComponent: 'image',
  };
}

export function placeholderMobile() {
  return {
    name: 'placeholderMobile',
    aclName: 'placeholder_placeholder-mobile',
    type: 'generic-file',
    label: 'Upload Mobile',
    link: 'attribute',
    subComponent: 'image',
  };
}

export function noMobileStretch() {
  return {
    name: 'noMobileStretch',
    aclName: 'placeholder_placeholder-desktop',
    type: 'generic-switch',
    label: 'Full Width In Mobile',
    link: 'styleOption',
    isInverted: true,
    subComponent: 'image',
  };
}

export function textAlign(props) {
  const { subComponent, aclName } = props || {};
  return {
    name: 'text-align',
    aclName: aclName || 'textAlignment_text-align',
    type: 'text-align',
    subComponent,
  };
}

export function width(props) {
  const {
    subComponent, aclName, type, checkbox, defaultValue,
    isPixel, isPercentage, label, minValue, value } = props || {};
  return {
    name: 'width',
    aclName: aclName || 'style_width',
    type: type || 'generic-number',
    label: label || 'Width (%)',
    checkbox,
    defaultValue,
    isPixel,
    isPercentage,
    link: 'attribute',
    minValue,
    subComponent,
    value: value || '',
  };
}

export function columnsCounter(props) {
  return {
    type: 'columns-counter',
    label: 'ColumnsCounter',
  };
}
