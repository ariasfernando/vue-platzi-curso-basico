export default {
  data() {
    return {
      trackingConfigReady: false,
      trackingConfig: {},
    };
  },
  computed: {
    campaignData() {
      return this.$store.getters['campaign/campaign'].campaign_data;
    },
  },
  created() {
    this.loadConfig();
  },
  methods: {
    loadConfig() {
      this.trackingConfig = JSON.parse(this.campaignData.library_config.trackingConfig || '{}');

      this.trackingConfigReady = true;
    },

    validateTracking() {
      if (typeof this.campaignData.tracking === 'undefined' || !this.campaignData.tracking) {
        this.$root.$toast(
          'Error: Tracking Configuration is required',
          {
            className: 'et-error',
            duration: 10000,
            closeable: true,
          },
        );

        return false;
      }

      const trackingData = this.campaignData.tracking;
      const $toast = this.$root.$toast;
      let ret = true;

      Object.keys(this.trackingConfig).forEach((param) => {
        const key = `trk-${param}`;

        if ((typeof this.trackingConfig[param].optional === 'undefined' || this.trackingConfig[param].optional !== true) &&
          (typeof trackingData[key] === 'undefined' || trackingData[key] === '')) {
          $toast(
            `Error: ${this.trackingConfig[param].label} is required`,
            {
              className: 'et-error',
              duration: 10000,
              closeable: true,
            },
          );
          ret = false;
        }
      });
      return ret;
    },

    addTrackingParams(html) {
      const trackingData = this.campaignData.tracking;
      const trackingConfig = this.trackingConfig;

      if (typeof trackingConfig === 'undefined' || typeof trackingData === 'undefined') {
        return null;
      }

      const trackingConfigGroups = { replace: {}, replaceLinks: {} };
      Object.keys(trackingConfig).forEach((param) => {
        if (trackingConfig[param].replaceString) {
          trackingConfigGroups.replace[param] = trackingConfig[param];
        } else {
          trackingConfigGroups.replaceLinks[param] = trackingConfig[param];
        }
      });

      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');
      const links = Array.from(dom.querySelectorAll('a')).filter(link => !link.classList.contains('st-no-tracking') && !link.getAttribute('href').includes('mailto'));

      if (Object.keys(trackingConfigGroups.replaceLinks).length > 0) {
        links.forEach((link) => {
          let linkHref = link.getAttribute('href');

          if (linkHref === '' || linkHref === '#') {
            return false;
          }

          linkHref = this.addTrackingParamsToHref(linkHref, trackingConfigGroups);

          link.setAttribute('href', linkHref);

          return true;
        });
      }

      if (Object.keys(trackingConfigGroups.replace).length > 0) {
        Object.keys(trackingConfigGroups.replace).forEach((param) => {
          const key = `trk-${param}`;
          const search = trackingConfigGroups.replace[param].replaceString;
          const replacement = trackingData[key];
          dom.body.firstChild.innerHTML = dom.body.firstChild.innerHTML.replace(new RegExp(search, 'g'), replacement);
        });
      }

      const tmpWrapper = document.createElement('div');
      if (dom.body.childNodes.length > 1) {
        Array.from(dom.body.childNodes).forEach((child) => {
          tmpWrapper.appendChild(child);
        });

        return this.replaceDataOutlookHref(tmpWrapper.innerHTML, trackingConfigGroups);
      }

      tmpWrapper.appendChild(dom.body.firstChild);
      return this.replaceDataOutlookHref(tmpWrapper.innerHTML, trackingConfigGroups);
    },
    /**
   * @param {string} href
   * @param {Object} trackingConfigGroups
   * @returns {string} href with tracking params
   */
    addTrackingParamsToHref(href, trackingConfigGroups) {
      const trackingData = this.campaignData.tracking;
      let linkHref = href;
      let anchor = '';
      const anchorPos = linkHref.indexOf('#');

      if (anchorPos !== -1) {
        anchor = linkHref.substring(anchorPos);
        linkHref = linkHref.replace(anchor, '');
      }

      if (linkHref.length > 0) {
        Object.keys(trackingConfigGroups.replaceLinks).forEach((param) => {
          const key = `trk-${param}`;
          const separator = linkHref.indexOf('?') !== -1 ? '&' : '?';
          if (typeof trackingData[key] === 'undefined' || trackingData[key].length > 0) {
            linkHref += `${separator}${param}=${trackingData[key]}`;
          }
        });
      }

      if (anchor.length) {
        linkHref += anchor;
      }

      return linkHref;
    },
    /**
     * Replace data-outlook-href with href and tracking params
     * @param {string} html
     * @param {Object} trackingConfigGroups
     * @returns {string} html
     */
    replaceDataOutlookHref(html, trackingConfigGroups) {
      return html.replace(
        /data-outlook-href="([^"]+)"/g,
        (match, hrefValue) => `href="${this.addTrackingParamsToHref(hrefValue, trackingConfigGroups)}"`,
      );
    },
  },
};
