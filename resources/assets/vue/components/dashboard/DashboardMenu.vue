<template>
  <div>
    <a v-if="showDefaultButton"
      @click="checkLibrary"
      class="btn btn-default btn-create beta-btn-primary" :href="$_app.config.baseUrl + '/campaign/edit/' + '?locale=en_us'">
      <i class="glyphicon glyphicon-plus-sign"></i> Create a new email
    </a>

    <div v-if="showLanguagesButton">
      <button class="btn btn-default dropdown-toggle beta-btn-primary" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
        <i class="glyphicon glyphicon-plus-sign"></i> Create a new email<span class="caret"></span>
      </button>
      <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          <li v-for="(locale, key, index) in localeConfig.langs" role="presentation">
            <a :href="$_app.config.baseUrl + '/campaign/edit?locale=' + key">{{locale.name}}</a>
          </li>
      </ul>
    </div>

    <div v-if="showLibrariesButton">
      <button class="btn btn-default dropdown-toggle beta-btn-primary" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
        <i class="glyphicon glyphicon-plus-sign"></i> Create a new email<span class="caret"></span>
      </button>
      <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
        <li role="presentation">
        <li v-for="library in libraries" role="presentation">
          <a :href="$_app.config.baseUrl + '/campaign/edit?locale=en_us&library=' + library._id">
            {{library.name}}
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import configService from '../../services/config';
  import libraryService from '../../services/library';

  export default {
    data: function() {
      return {
        viewConfig: {},
        localeConfig: {},
        libraries: {}
      }
    },
    computed: {
      showDefaultButton: function() {
        if (this.viewConfig.campaign_format === 'languages') {
          return false;
        }
        return this.libraries.length < 2;
      },
      showLanguagesButton: function() {
        return this.viewConfig.campaign_format === 'languages'
      },
      showLibrariesButton: function() {
        if (this.viewConfig.campaign_format === 'libraries') {
          return this.libraries.length > 1;
        }
        return false;
      }
    },
    props: {
      config: {
        type: Object,
        required: true
      }
    },
    created: function() {
      configService.getConfig('view').then((response) => {
        this.viewConfig = response;
      });

      configService.getConfig('locale').then((response) => {
        this.localeConfig = response;
      });

      let data = {
        limit: -1
      };

      libraryService.fetchLibraries(data).then((response) => {
        this.libraries = response;
        if (response.data) {
          this.libraries = response.data;
        }
      })
      .catch((error) => {
        this.$root.$toast(error, {className: 'et-error'});
      });

    },
    methods: {
      checkLibrary (event) {
        if (!this.libraries.length) {
          event.preventDefault();
          this.$root.$toast('Oops! There are no libraries available, please contact our support team.', {className: 'et-error'});
        }
      }
    }
  }
</script>