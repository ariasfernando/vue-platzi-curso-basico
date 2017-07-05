module.exports = {
  "type": "button-element",
  "defaultText": "CTA Button",
  "text": "Lorem ipsum",
  "enabled": true,
  "style": {
    "fontSize": "12px",
    "fontFamily": "Arial, sans-serif",
    "lineHeight": "16px",
    "background_colors": {
      "default": "#222",
      "list": {
        "Black": "#222",
        "@hex": "%%=v(@hex)=%%"
      }
    },
    "font_colors": {
      "default": "#FFFFFF",
      "list": {
        "White": "#FFFFFF",
        "Black": "#000000",
        "@hex": "%%=v(@hex)=%%"
      }
    }
  },
  "properties": {
    "url": {
      "placeholder": "http://www.google.com",
      "validation": {
        "required": true,
        "mailto": true,
        "autoProtocol": true,
        "regex": "/[^a-zA-Z0-9-_]/g"
      }
    }
  },
  "directives": {
    "truncate": 50,
    "maxLines": 1
  }
};