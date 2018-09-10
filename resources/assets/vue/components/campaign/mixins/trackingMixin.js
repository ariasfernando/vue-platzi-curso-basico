import _ from 'lodash';

export default {
  data() {
    return {
      trackingConfigReady: true,
      trackingConfig: {},
      trackingData: {
        'trk-utm_source': '',
        'trk-utm_campaign': '',
        'trk-utm_medium': '',
        'trk-source': '',
        'trk-utm_term': ''
      }
    }
  },
  computed: {
    configs() {
      return this.$store.getters["config/config"];
    },
    campaignData() {
      return this.$store.getters["campaign/campaign"].campaign_data;
    }
  },
  created() {
    this.loadConfig();
  },
  methods: {
    loadConfig() {
      if (this.campaignData.tracking !== undefined) {
        this.trackingData = this.campaignData.tracking;
      }
      this.$store.dispatch("config/getConfig", 'tracking').then(response => {
        var configs = this.configs;

        if (configs.tracking[this.libraryKey] !== undefined) {
          this.trackingConfig = configs.tracking[this.libraryKey];
        } else {
          this.trackingConfig = configs.tracking['default'];
        }
        for (let k in this.trackingConfig) {
          if (this.trackingData['trk-'+k] === undefined || this.trackingData['trk-'+k] == '') {
            this.trackingData['trk-'+k] = this.trackingConfig[k].values;
          }
        }
        this.trackingConfigReady = true;
      }, error => {
        this.$store.commit("global/setLoader", false);
        this.$root.$toast(
          'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
          {className: 'et-error'}
        );
      });
    },

    cleanErrors() {},

    validateTracking () {
      this.cleanErrors();
      if (typeof this.campaignData.tracking == 'undefined' || !this.campaignData.tracking) {
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

      var trackingData = this.campaignData.tracking;
      var $toast = this.$root.$toast;
      var ret = true;
      $.each(_.keys(this.trackingConfig), function(idx, param) {
        if (typeof trackingData['trk-'+param] == 'undefined' || trackingData['trk-'+param] == '') {
          $toast(
            'Error: ' + param + ' is required',
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

      var trackingData = this.campaignData.tracking;
      var trackingConfig = this.trackingConfig;
      if(typeof(trackingConfig) != 'undefined' && typeof(trackingData) != 'undefined' ){

        var links = html.find("a");
        $.each( links, function( index, link){

          var trackingPosition = $(link).closest( "th" ).attr('data-tracking-position');
          if (typeof(trackingPosition) == "undefined"){
            trackingPosition = $(link).closest( "td" ).attr('data-tracking-position');
          }
          if (typeof(trackingPosition) == "undefined"){
            trackingPosition = $(link).attr('data-tracking-position');
          }

          if ($(link).hasClass('st-no-tracking') === false){
            var linkHref = $(link).attr("href");
            if( linkHref!=="" && linkHref!=="#"){
              var anchor = '';
              var anchorPos = linkHref.indexOf('#');
              if (anchorPos !== -1) {
                anchor = linkHref.substring(anchorPos);
                linkHref = linkHref.replace(anchor, '');
              }
              if (linkHref.length > 0) {
                $.each( _.keys(trackingConfig), function(idx, param){
                  var separator = linkHref.indexOf('?') !== -1 ? "&" : "?";
                  var value = ( typeof trackingData['trk-'+param] !== 'undefined' ) ? trackingData['trk-'+param] : '' ;
                  linkHref += separator + param + "=" + value;
                });
                if (typeof(trackingPosition) != "undefined"){
                  linkHref += "&utm_content=" + trackingPosition;
                }
              }
              if (anchor.length) {
                linkHref += anchor;
              }
              $(link).attr('href', linkHref);
            }
          }
        });
      }
      return html;
    },
  },
};
