module.exports = {
  "type": "image-element",
  "placeholder": "/images/studio/placeholder-square.jpg",
  "width": "220",
  "height": "auto",
  "style": {
    "width": "220px",
    "height": "auto",
    "verticalAlign": "middle"
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
  "target": "_blank",
  "directives": {
    "elementConfig": "mie_v2_default_adjustable_height"
  }
};