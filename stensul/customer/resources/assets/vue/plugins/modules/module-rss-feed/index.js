const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'module-rss-feed',
  title: 'RSS Feed',
  version: '0.0.1',
  author: 'hanuman.peri@stensul.com',
  target: ['module', 'row', 'column'],
  campaignSettings,
  config: {
    source: {
      type: 'rss',
      url: 'https://threatvector.cylance.com/content/dam/cylance-blog/en_us/rss_en_us.xml',
      feedPath: 'rss.channel.item',
    },
    filters: {
      searchPaths: [
        'description',
        'title',
        'link',
        'creator',
      ],
    },
    commits: [
      {
        type: 'element',
        match: {
          name: 'description',
        },
        entryPath: 'description',
        mask: '<p>${value}</p>',
        commitPath: 'data.text',
      },
      {
        type: 'element',
        match: {
          name: 'title',
        },
        entryPath: 'title',
        mask: '<p>${value}</p>',
        commitPath: 'data.text',
      },
    ],
  },
  data: {},
  render: true,
  enabled: false,
};
