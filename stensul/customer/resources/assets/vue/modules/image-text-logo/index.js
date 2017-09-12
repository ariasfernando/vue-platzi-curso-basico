import Component from './component.vue';

module.exports = {
  name: 'image-text-logo',
  title: 'Image + Text + Logo',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  Component,
  config: {
    scaleRatio: 2,
    enabledOptions: 'destination_url alt_text image_upload image_crop image_tracking image_library fetch_url',
    enabledPlugins: 'overlay imageLibrary imageTracking fetchUrl',
    libraryFolder: 'hero',
    size: {
      height: 400,
      width: 660,
    },
    labels: {
      file_upload: 'Allowed file types: png, jpg and gif.',
    },
    overlays: [
      {
        type: 'image',
        width: 210,
        id: 'stensul-logo',
        class: 'graphic-header-logo',
        path: '/_common/images/en_us/logo-hero-stensul.png',
        control_id: 'image-overlay',
        control_label: 'Display logo',
        save_as: 'logo_overlay',
      },
      {
        type: 'rich_text',
        save_as: 'text1',
        id: 'overlay-rich-text',
        default: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</p>',
        class: 'stensul-rich-text',
        reposition: true,
        options: {
          formats: {
            underline: {
              inline: 'u',
              exact: true,
            },
          },
          fixed_toolbar_container: '.rich-text-container .rich-text-toolbox',
          toolbar: 'bold italic underline forecolor alignleft aligncenter alignright',
          plugins: 'paste advlist autolink lists textcolor',
          forced_root_block: 'div',
          inline: true,
          target_list: false,
          link_validate_url: true,
          link_title: false,
          link_text_to_display: false,
          paste_as_text: true,
          menubar: false,
          relative_urls: false,
          remove_script_host: false,
        },
      },
    ],
  },
  data: {},
  enabled: false,
};
