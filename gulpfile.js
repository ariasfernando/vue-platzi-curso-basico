/*
 | --------------------------------------------------------------------------
 | Disable notifier
 | --------------------------------------------------------------------------
 */

process.env.DISABLE_NOTIFIER = true;

/*
 | --------------------------------------------------------------------------
 | load .env (if exists)
 | --------------------------------------------------------------------------
 */

require('dotenv').config();

/*
 | --------------------------------------------------------------------------
 | Requires
 | --------------------------------------------------------------------------
 */
let elixir = require('laravel-elixir');
let gulp = require('gulp');
let fs = require('fs');
let data = require('gulp-data');
let path = require('path');
let gulpsync = require('gulp-sync')(gulp);

require('elixir-jshint');
require('laravel-elixir-vueify');

/*
 | --------------------------------------------------------------------------
 | Define App name
 | --------------------------------------------------------------------------
 */

let appName = process.env.APP_NAME.toLowerCase() || "base";

/*
 | --------------------------------------------------------------------------
 | Include file from App path in case it exists, if not from Base path
 | --------------------------------------------------------------------------
 */

let jsAppFilePath = (file) => {
    if (fs.existsSync('resources/assets/js/' + appName + '/' + file)) {
        return 'js/' + appName + '/' + file;
    }
    else {
        return 'js/base/' + file;
  }
};

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.config.cssOutput = 'public/css';
elixir.config.sourcemaps = false;

// if (elixir.config.babel) {
//   elixir.config.babel.enabled = false;
// }

/*
 | --------------------------------------------------------------------------
 | jsHint task
 | --------------------------------------------------------------------------
 */
gulp.task('elixir-jshint', () => {
  elixir((mix) => {
    mix.jshint([
      'resources/assets/js/**/*'
    ]);
  });
});


/*
 | --------------------------------------------------------------------------
 | Vendor task
 | --------------------------------------------------------------------------
 */
gulp.task('elixir-copy-bower', function () {
  let bowerPath = 'resources/assets/bower/';

  elixir((mix) => {
    mix
    // Bootstrap colorpicker
      .copy(bowerPath + 'bootstrapcolorpicker/dist/img/bootstrap-colorpicker', 'public/css/images/bootstrap-colorpicker')
      // jQuery UI
      .copy(bowerPath + 'jquery-ui/themes/ui-lightness/images', 'public/css/images/jquery-ui')
      // TinyMCE
      .copy(bowerPath + 'tinymce/skins', 'public/css/tinymce')
      .copy(bowerPath + 'tinymce/plugins/textcolor', 'public/js/plugins/tinymce/plugins/textcolor');
  });
});


/*
 | --------------------------------------------------------------------------
 | Customer task
 | --------------------------------------------------------------------------
 */
gulp.task('copy-customer-assets', () => {
  const customerAssetsPath = 'stensul/customer/resources/assets';

  elixir((mix) => {
    mix.copy(`${customerAssetsPath}/images`, 'public/images/customer');
    mix.copy(`${customerAssetsPath}/fonts`, 'public/fonts');
  });
});

/*
 | --------------------------------------------------------------------------
 | Scripts task
 | --------------------------------------------------------------------------
 */
gulp.task('elixir-scripts', function () {
  const assetsPath = 'resources/assets/';
  const customerAssetsPath = 'stensul/customer/' + assetsPath + 'vue/';
  const jsDestinationPath = 'public/js/';

  elixir((mix) => {
      mix
        mix.browserify(
          'main.js',
          jsDestinationPath + 'customer.js',
          customerAssetsPath
        )
        .browserify(
          'vue/campaign.js',
          jsDestinationPath + 'campaign-components.js',
          assetsPath
        )
        .browserify(
          'vue/studio-library.js',
          jsDestinationPath + 'studio-library.js',
          assetsPath
        )
        .browserify(
          'vue/studio-module.js',
          jsDestinationPath + 'studio-module.js',
          assetsPath
        )
        .browserify(
          'vue/proof.js',
          jsDestinationPath + "vue-components.js",
          assetsPath
        )
        .browserify(
          'vue/public-view.js',
          jsDestinationPath + "public-view.js",
          assetsPath
        )
        .browserify(
          [
            'vue/dashboard.js',
            'js/library/custom-plugins/st-pagination-bar.jquery.js',
          ],
          jsDestinationPath + "dashboard-components.js",
          assetsPath
        )
        // === Compile Vendor and Application scripts to library.js ===
        .scripts(
          [
            'bower/jquery/dist/jquery.js',
            'bower/jquery-ui/jquery-ui.min.js',
            'bower/bootstrap/dist/js/bootstrap.min.js',
            'bower/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
            'bower/bootstrap-select/dist/js/bootstrap-select.min.js',
            'bower/tinymce/tinymce.js',
            'bower/tinymce/themes/modern/theme.js',
            'bower/tinymce/plugins/image/plugin.js',
            'bower/tinymce/plugins/imagetools/plugin.js',
            'bower/tinymce/plugins/paste/plugin.js',
            'bower/tinymce/plugins/textcolor/plugin.js',
            'bower/tinymce/plugins/colorpicker/plugin.js',
            'bower/tinymce/plugins/lists/plugin.js',
            'bower/tinymce/plugins/autolink/plugin.js',
            'bower/tinymce/plugins/link/plugin.js',
            'bower/tinymce/plugins/advlist/plugin.js',
            'bower/magnific-popup/dist/jquery.magnific-popup.js',
            'bower/cropit/dist/jquery.cropit.js',
            'js/library/application-utils.js',
            'js/library/master-image-editor.v2.js',
            'js/library/modal-manager.js',
            'js/library/image-manager.js',
            'js/library/modals/*.js',
            'js/plugins/tinymce/**/plugin.js',
          ],
          jsDestinationPath + 'library-v2.js',
          assetsPath
        )

        // === Compile Vendor and Application scripts to library.js ===
        .scripts(
          [
            'bower/underscore/underscore.js',
            'bower/jquery/dist/jquery.min.js',
            'bower/jquery-ui/jquery-ui.min.js',
            'bower/bootstrap/dist/js/bootstrap.min.js',
            'bower/magnific-popup/dist/jquery.magnific-popup.js',
            'bower/cropit/dist/jquery.cropit.js',
            'bower/bootstrapcolorpicker/dist/js/bootstrap-colorpicker.min.js',
            'bower/bootstrap-select/dist/js/bootstrap-select.min.js',
            'bower/noty/js/noty/packaged/jquery.noty.packaged.js',
            // -- Jquery Simple colorpicker List --
            'bower/jquery-simplecolorpicker/jquery.simplecolorpicker.js',
            // -- TinyMCE editor --
            'bower/tinymce/tinymce.js',
            'bower/tinymce/themes/modern/theme.js',
            'bower/tinymce/plugins/paste/plugin.js',
            'bower/tinymce/plugins/textcolor/plugin.js',
            'bower/tinymce/plugins/colorpicker/plugin.js',
            'bower/tinymce/plugins/lists/plugin.js',
            'bower/tinymce/plugins/autolink/plugin.js',
            'bower/tinymce/plugins/link/plugin.js',
            'bower/tinymce/plugins/advlist/plugin.js',
            // -- zxcvbn --
            'bower/zxcvbn/dist/zxcvbn.js',
            // -- Vue --
            'bower/vue/dist/vue.min.js',
            // -- Extended plugins --
            'js/plugins/**/*.js',
            // -- Common scripts --
            'js/library/helpers/*.js',
            'js/library/custom-plugins/html2canvas-0.5.0-modified.js', // include always before application-utils.js
            'js/library/application-globals.js',
            'js/library/application-utils.js',
            'js/library/application-init.js',
            'js/library/application-api.js',
            'js/library/login.js'
          ],
          jsDestinationPath + 'library.js',
          assetsPath
        )

        // === Dashboard page ===
        .scripts(
          [
            // @TODO turn the rest of the modals into Vue components like ModalProof.vue
            'js/library/application-proof.js',
          ],
          jsDestinationPath + 'dashboard-proof.js',
          assetsPath
        )

        // === Proof page ===
        .scripts(
            jsAppFilePath('proof.js'),
            jsDestinationPath + 'proof.js',
            assetsPath
        )

        // === Admin page ===
        .scripts(
          [
            'js/library/custom-plugins/st-pagination-bar.jquery.js',
            'js/library/admin/*.js',
            jsAppFilePath('admin.js')
          ],
          jsDestinationPath + 'admin.js',
          assetsPath
        )

        // === Campaign page ===
        .scripts(
          [
            // Transformers
            'js/library/transformers.js',
            // Custom Plugins
            'js/library/custom-plugins/st-pagination-bar.jquery.js',
            'js/library/custom-plugins/st-color-picker.js',
            // Configuration Modals [ Deprecated ]
            'js/library/modals/*',
            // Library
            'js/library/image-library.js',
            'js/library/master-image-editor.js',
            'js/library/master-image-editor.v2.js',
            'js/library/master-button-editor.js',
            'js/library/module-manager.js',
            'js/library/modal-manager.js',
            'js/library/campaign-menu.js',
            'js/library/image-manager.js',
          ],
          jsDestinationPath + 'campaign.js',
          assetsPath
        );
    }
  );
});

/*
 | --------------------------------------------------------------------------
 | Compile LESS
 | --------------------------------------------------------------------------
 */
gulp.task('elixir-less', () => {
    elixir((mix) => {
        mix.less( appName + '/tool/tool.less');
        mix.less( appName + '/base-v2/admin.less');
    });
});

/*
 | --------------------------------------------------------------------------
 | Elixir Version
 | --------------------------------------------------------------------------
 */
gulp.task('elixir-version', () => {
  elixir((mix) => {
    mix.version([
      'css/admin.css',
      'css/tool.css',
      'js'
    ]);
  });
});

/*
 | --------------------------------------------------------------------------
 | Gulp Tasks
 | --------------------------------------------------------------------------
 */
gulp.task('jshint', ['elixir-jshint']);
gulp.task('watch', gulpsync.sync(['elixir-less', 'elixir-scripts', 'elixir-copy-bower', 'elixir-version']));
gulp.task('default', gulpsync.sync(['copy-customer-assets', 'elixir-less', 'elixir-scripts', 'elixir-copy-bower', 'elixir-version']));
