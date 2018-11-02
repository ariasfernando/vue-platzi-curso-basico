/* global path */
/*
 NOTES: .scripts() doesn't work with watch you'll have to run watch again if you're editing legacy 
 files (E.g. application-globals.js).
*/

const mix = require('laravel-mix');
const fs = require('fs');
const _ = require('lodash');
const del = require('del');
const jsonFile = require('jsonfile');

const assetsPath = 'resources/assets';
const assetsVuePath = `${assetsPath}/vue`;
const jsDestinationPath = 'public/js';
const customerAssetsPath = 'stensul/customer/resources/assets';

require('dotenv').config();

function jsAppFilePath(file) {
  return `/js/base/${file}`;
}

mix.webpackConfig({
  node: {
    fs: 'empty',
  },
  resolve: {
    alias: {
      customer: path.join(__dirname, `${customerAssetsPath}/vue`),
      stensul: path.join(__dirname, assetsVuePath),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        use: [
          {
            loader: 'webpack-strip-block',
          },
        ],
      },
    ],
  },
});

mix
  .setPublicPath('public/')
  .options({
    extractVueStyles: false,
    processCssUrls: false,
  })
  .autoload({
    $: 'jquery',
    jQuery: 'jquery',
  })
  .less(`${assetsPath}/less/base/commons/mobile/mobile_core_styles.less`, 'public/css/mobile_core_styles.css')
  .less(`${assetsPath}/less/base/commons/mobile/mobile_client_styles.less`, 'public/css/mobile_client_styles.css')
  .less(`${assetsPath}/less/base/tool/tool.less`, 'public/css/tool.css')
  .less(`${assetsPath}/less/base/base-v2/admin.less`, 'public/css/admin.css')
  .js([
    `${assetsVuePath}/campaign.js`,
  ], `${jsDestinationPath}/campaign-components.js`)
  .js([
    `${assetsVuePath}/studio-library.js`,
  ], `${jsDestinationPath}/studio-library.js`)
  .js([
    `${assetsVuePath}/studio-module.js`,
  ], `${jsDestinationPath}/studio-module.js`)
  .js([
    `${assetsVuePath}/proof.js`,
  ], `${jsDestinationPath}/vue-components.js`)
  .js([
    `${assetsVuePath}/public-view.js`,
  ], `${jsDestinationPath}/public-view.js`)
  .js([
    `${assetsVuePath}/dashboard.js`,
    `${assetsPath}/js/library/custom-plugins/st-pagination-bar.jquery.js`,
  ], `${jsDestinationPath}/dashboard-components.js`)
  .js(`${assetsPath}/js/vendor/stensul/media-gallery/media-gallery.js`, 'public/js/media-gallery.js')
  .js(assetsPath + jsAppFilePath('proof.js'), `${jsDestinationPath}/proof.js`)
  .js([
    `${assetsVuePath}/global-settings.js`,
  ], `${jsDestinationPath}/global-settings.js`)
  .extract([
    'vue',
    'vue-router',
    'vue-resource/dist/vue-resource',
    'vee-validate',
    'vue-easy-toast',
    'bootstrap-vue',
    'element-ui',
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/locale/lang/en',
    'lodash',
  ])
  .scripts([
    `${assetsPath}/js/library/helpers/*.js`,
    `${assetsPath}/js/library/application-utils.js`,
  ], `${jsDestinationPath}/application-utils-v2.js`)
  .scripts([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery-ui/jquery-ui.min.js',
    'node_modules/jquery-mousewheel/jquery.mousewheel.min.js',
    'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
  ], `${jsDestinationPath}/jquery.js`)
  .scripts([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
  ], `${jsDestinationPath}/bootstrap.js`)
  .scripts([
    // -- TinyMCE editor --
    'node_modules/tinymce/tinymce.js',
    'node_modules/tinymce/themes/modern/theme.js',
    'node_modules/tinymce/plugins/image/plugin.js',
    'node_modules/tinymce/plugins/imagetools/plugin.js',
    'node_modules/tinymce/plugins/paste/plugin.js',
    'node_modules/tinymce/plugins/textcolor/plugin.js',
    'node_modules/tinymce/plugins/colorpicker/plugin.js',
    'node_modules/tinymce/plugins/lists/plugin.js',
    'node_modules/tinymce/plugins/autolink/plugin.js',
    'node_modules/tinymce/plugins/link/plugin.js',
    'node_modules/tinymce/plugins/advlist/plugin.js',
    `${assetsPath}/js/plugins/**/*.js`,
    `${customerAssetsPath}/js/plugins/**/*.js`,
  ], `${jsDestinationPath}/tinymce.js`)
  .scripts([
    'node_modules/underscore/underscore.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery-ui/jquery-ui.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    'node_modules/cropit/dist/jquery.cropit.js',
    'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
    'node_modules/noty/js/noty/packaged/jquery.noty.packaged.js',
    // -- Jquery Simple colorpicker List --
    'node_modules/jquery-simplecolorpicker/jquery.simplecolorpicker.js',
    // -- TinyMCE editor --
    'node_modules/tinymce/tinymce.js',
    'node_modules/tinymce/themes/modern/theme.js',
    'node_modules/tinymce/plugins/paste/plugin.js',
    'node_modules/tinymce/plugins/textcolor/plugin.js',
    'node_modules/tinymce/plugins/colorpicker/plugin.js',
    'node_modules/tinymce/plugins/lists/plugin.js',
    'node_modules/tinymce/plugins/autolink/plugin.js',
    'node_modules/tinymce/plugins/link/plugin.js',
    'node_modules/tinymce/plugins/advlist/plugin.js',
    'node_modules/zxcvbn/dist/zxcvbn.js',
    'node_modules/tinymce/plugins/noneditable/plugin.js',
    // -- Vue --
    'node_modules/vue/dist/vue.min.js',
    // -- Extended plugins --
    `${assetsPath}/js/plugins/**/*.js`,
    // -- Common scripts --
    `${assetsPath}/js/library/helpers/*.js`,
    `${assetsPath}/js/library/application-globals.js`,
    `${assetsPath}/js/library/application-utils.js`,
    `${assetsPath}/js/library/custom-plugins/html2canvas-0.5.0-modified.js`,
    `${assetsPath}/js/library/application-init.js`,
    `${assetsPath}/js/library/application-api.js`,
    `${assetsPath}/js/library/login.js`,
  ], `${jsDestinationPath}/library.js`)
  .scripts([
    'node_modules/jquery/dist/jquery.min.js',
    `${assetsPath}/js/library/login.js`,
  ], `${jsDestinationPath}/login.js`)
  .scripts([
    `${assetsPath}/js/library/application-proof.js`,
  ], `${jsDestinationPath}/dashboard-proof.js`)
  .scripts([
    'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    `${assetsPath}/js/library/custom-plugins/st-pagination-bar.jquery.js`,
    `${assetsPath}/js/library/admin/*.js`,
    assetsPath + jsAppFilePath('admin.js'),
  ], `${jsDestinationPath}/admin.js`)
  // .sourceMaps()
  .copyDirectory('node_modules/tinymce/plugins/textcolor', './public/build/js/plugins/tinymce/plugins/textcolor')
  // Bootstrap colorpicker
  // jQuery UI
  .copyDirectory('node_modules/jquery-ui/themes/base/images', 'public/css/images/jquery-ui')
  // TinyMCE
  .copyDirectory('node_modules/tinymce/skins', 'public/css/tinymce')
  .copyDirectory('node_modules/tinymce/plugins/textcolor', 'public/js/plugins/tinymce/plugins/textcolor')
  // Customer Assets
  .copyDirectory(`${customerAssetsPath}/images`, 'public/images/customer')
  .copyDirectory(`${customerAssetsPath}/fonts`, 'public/fonts')
  .copyDirectory('public/fonts', 'public/build/fonts')
  // .copyDirectory('public/images', 'public/build/images')
  .version()
  .then(() => {
    const revManifest = './public/build/rev-manifest.json';
    // For some reason laravel expects it in public directory
    const mixManifest = './public/mix-manifest.json';

    jsonFile.readFile(revManifest, (err, obj) => {
      const newJson = {};
      _.forIn(obj, (value, key) => {
        const newFilename = value.replace(/([^\.]+)\.([^\?]+)\?id=(.+)$/g, '$1-$3.$2');
        const oldAsGlob = value.replace(/([^\.]+)\.([^\?]+)\?id=(.+)$/g, '$1-*.$2');
        // delete old versioned file
        del.sync([`public${oldAsGlob}`]);
        // copy as new versioned
        fs.copyFile(`public${key}`, `public/${newFilename}`, (copyError) => {
          if (copyError) console.error(copyError);
        });
        newJson[key] = newFilename;
      });
      jsonFile.writeFile(mixManifest, newJson, { spaces: 2 }, (writeError) => {
        if (writeError) console.error(writeError);
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[37m%s\x1b[36m%s\x1b[0m', `${process.env.APP_NAME} tool running on --> `, process.env.APP_BASE_URL);
      }
    });
  });

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.ts(src, output); <-- Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//  extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//  globalVueStyles: file, // Variables file to be imported in every component.
//  processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//  purifyCss: false, // Remove unused CSS selectors.
//  uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//  postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
