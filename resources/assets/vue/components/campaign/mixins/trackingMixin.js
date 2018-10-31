export default {
  data() {
    return {
      trackingConfigReady: false,
      trackingConfig: {},
      trackingData: {}
    }
  },
  computed: {
    campaignData() {
      return this.$store.getters['campaign/campaign'].campaign_data;
    }
  },
  created() {
    this.loadConfig();
  },
  methods: {
    loadConfig() {
      this.trackingConfig = JSON.parse(this.campaignData.library_config.trackingConfig);

      if (this.campaignData.tracking !== undefined) {
        this.trackingData = this.campaignData.tracking;
      } else {
        for (let k in this.trackingConfig) {
          this.trackingData[`trk-${this.trackingConfig[k].name}`] = this.trackingConfig[k].values;
        }
      }

      this.trackingConfigReady = true;
    },

    validateTracking () {
      if (typeof this.campaignData.tracking === 'undefined' || !this.campaignData.tracking) {
        this.$root.$toast(
          'Error: Tracking Configuration is required',
          {
            className: 'et-error',
            duration: 10000,
            closeable: true
          }
        );

        return false;
      }

      let trackingData = this.campaignData.tracking;
      let $toast = this.$root.$toast;
      let ret = true;

      Object.keys(this.trackingConfig).forEach((param) => {
        let key = `trk-${param}`;

        if (typeof trackingData[key] === 'undefined' || trackingData[key] === '') {
          $toast(
            `Error: ${param} is required`,
            {
              className: 'et-error',
              duration: 10000,
              closeable: true
            }
          );
          ret = false;
        }
      });
      return ret;
    },

    addTrackingParams (html) {
      const trackingData   = this.campaignData.tracking;
      const trackingConfig = this.trackingConfig;

      if (typeof trackingConfig === 'undefined' || typeof trackingData === 'undefined') {
        return null;
      }

      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');
      const links = Array.from(dom.querySelectorAll('a'));

      links.forEach((link) => {
        let trackingPosition = link.closest('th') ? link.closest('th').getAttribute('data-tracking-position') : false;

        if (!trackingPosition) {
          trackingPosition = link.closest('td').getAttribute('data-tracking-position');
        }

        if (!trackingPosition) {
          trackingPosition = link.getAttribute('data-tracking-position');
        }

        if (!link.classList.contains('st-no-tracking')) {
          let linkHref = link.getAttribute('href');

          if (linkHref === '' || linkHref === '#') {
            return false;
          }

          let anchor = '';
          const anchorPos = linkHref.indexOf('#');

          if (anchorPos !== -1) {
            anchor = linkHref.substring(anchorPos);
            linkHref = linkHref.replace(anchor, '');
          }

          if (linkHref.length > 0) {
            Object.keys(trackingConfig).forEach((param) => {
              let key = `trk-${param}`;
              let separator = linkHref.indexOf('?') !== -1 ? '&' : '?';
              let value = typeof trackingData[key] !== 'undefined' ? trackingData[key] : '';
              linkHref += `${separator}${param}=${value}`;
            });

            if (trackingPosition) {
              linkHref += `&utm_content=${trackingPosition}`;
            }
          }

          if (anchor.length) {
            linkHref += anchor;
          }

          link.setAttribute('href', linkHref);
        }
      });

      let serializer = new XMLSerializer();
      if (dom.body.childNodes.length > 1) {
        let result = '';
        dom.body.childNodes.forEach((child) => {
          result += serializer.serializeToString(child);
        });

        return result;
      }

      return serializer.serializeToString(dom.body.firstChild);
    },
  },
};
