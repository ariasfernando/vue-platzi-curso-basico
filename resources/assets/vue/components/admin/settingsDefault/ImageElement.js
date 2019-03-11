import {
  alt,
  bgcolor,
  classes,
  href,
  imageSize,
  noMobileStretch,
  padding,
  placeholder,
  placeholderMobile,
  textAlign,
} from './settings';

function imageDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Images',
        settings: [
          placeholder(),
          placeholderMobile(),
          imageSize(),
          noMobileStretch(),
        ],
      },
      {
        groupLabel: 'Design',
        settings: [
          bgcolor({ subComponent: 'container' }),
          textAlign({ subComponent: 'image', aclName: 'text_text-align' }),
        ],
      },
      {
        groupLabel: 'Padding',
        settings: [
          padding({ subComponent: 'container', aclName: 'padding_padding' }),
        ],
      },
      {
        groupLabel: 'Behavior',
        settings: [
          href({ subComponent: 'image' }),
          alt(),
          classes({ subComponent: 'container', aclName: 'placeholder_classes' }),
        ],
      },
    ],
  };
}

module.exports = imageDefault;
