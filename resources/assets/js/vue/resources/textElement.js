module.exports = {
  "type": "text-element",
  "text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
  "style": {
    "width": "220",
    "verticalAlign": "middle",
    "textAlign": "left",
    "fontFamily": "sans-serif",
    "fontSize": "12px",
    "fontWeight": "normal",
    "lineHeight": "16px",
    "color": "#000000"
  },
  "settings": [
    {
      "label": "Color",
      "name": "color",
      "type": "text",
      "value": "#000000"
    },
    {
      "label": "Line Height",
      "name": "lineHeight",
      "type": "text",
      "value": "12px"
    },
    {
      "label": "Padding Top",
      "name": "paddingTop",
      "type": "text",
      "value": "10px"
    },
    {
      "label": "Padding Right",
      "name": "paddingRight",
      "type": "text",
      "value": "10px"
    },
    {
      "label": "Padding Bottom",
      "name": "paddingBottom",
      "type": "text",
      "value": "10px"
    },
    {
      "label": "Padding Right",
      "name": "paddingRight",
      "type": "text",
      "value": "10px"
    }
  ],
  "userSettings": [
    {
      "label": "Text Editable",
      "name": "editor",
      "type": "switch",
      "value": true,
      "options": [
        {
          "label": "Bold",
          "name": "bold",
          "type": "switch",
          "value": true
        },
        {
          "label": "Italic",
          "name": "italic",
          "type": "switch",
          "value": true
        },
        {
          "label": "Link",
          "name": "link",
          "type": "switch",
          "value": true
        },
        {
          "label": "Max length",
          "name": "maxLength",
          "type": "text",
          "value": 100
        }
      ]
    }
  ],
  "editor": {
    "formats": {
      "underline": {
        "inline": "u",
        "exact": true
      }
    },
    "selector": ".st-edit-text",
    "fixed_toolbar_container": ".text-overlay .text-overlay-toolbox",
    "toolbar": "bold italic underline link fontsizeselect",
    "plugins": "paste advlist autolink lists",
    "fontsize_formats": "14px 16px 22px",
    "forced_root_block": false,
    "inline": true,
    "target_list": false,
    "link_validate_url": true,
    "link_title": false,
    "link_text_to_display": false,
    "paste_as_text": true,
    "menubar": false,
    "relative_urls": false,
    "remove_script_host": false
  }
};