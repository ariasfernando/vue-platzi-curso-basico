class Plugin {
  constructor(properties) {
    this.properties = {
      name: properties.name || undefined,
      title: properties.title || 'Untitled Plugin',
      version: properties.version || undefined,
      author: properties.author || undefined,
      target: properties.target || [],
      config: properties.config || {},
      data: properties.data || {},
      render: properties.render || false,
      enabled: properties.enabled || false,
    };
  }

  getProperties() {
    return this.properties;
  }
}

module.exports = Plugin;
