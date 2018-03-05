let mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');
const appName = process.env && process.env.APP_NAME && process.env.APP_NAME.toLowerCase() || 'base';
const assetsPath = 'resources/assets/';
const assetsVuePath = `${assetsPath}/vue/`;
const jsDestinationPath = 'public/js/';
const customerAssetsPath = 'stensul/customer/resources/assets';
function jsAppFilePath (file) {
    return 'js/base/' + file;
}

mix.webpackConfig({
    node: {
      fs: "empty"
    }
});

mix
  .setPublicPath('public/')
  .options({
    extractVueStyles: false,
    processCssUrls: false
  })
  .autoload({
    $: "jquery",
    jQuery: "jquery"
  })
  .less(assetsPath + 'less/base/tool/tool.less', `public/css/tool.css`)
  .less(assetsPath + 'less/base/base-v2/admin.less', `public/css/admin.css`)
  .js([
    customerAssetsPath + '/vue/main.js'
  ], `${jsDestinationPath}customer.js`)
  .js([
    assetsVuePath + 'campaign.js'
  ], `${jsDestinationPath}campaign-components.js`)
  .js([
    assetsVuePath + 'studio-library.js'
  ], `${jsDestinationPath}studio-library.js`)
  .js([
    assetsVuePath + 'studio-module.js'
  ], `${jsDestinationPath}studio-module.js`)
  .js([
    assetsVuePath + 'proof.js'
  ], `${jsDestinationPath}vue-components.js`)
  .js([
    assetsVuePath + 'public-view.js'
  ], `${jsDestinationPath}public-view.js`)
  .js([
    assetsVuePath + 'dashboard.js',
    assetsPath + 'js/library/custom-plugins/st-pagination-bar.jquery.js'
  ], `${jsDestinationPath}dashboard-components.js`)
  .scripts([
    `node_modules/magnific-popup/dist/jquery.magnific-popup.js`,
    'js/library/application-utils.js',
    // 'js/library/master-image-editor.v2.js',
    // 'js/library/modal-manager.js',
    // 'js/library/image-manager.js',
    // 'js/library/modals/*.js',
    // 'js/library/helpers/*.js',
  ], `${jsDestinationPath}/application-utils-v2.js`)
  .scripts([
    `node_modules/jquery/dist/jquery.min.js`,
    `node_modules/jquery-ui/jquery-ui.min.js`,
  ], `${jsDestinationPath}/jquery.js`)
  .scripts([
    `node_modules/bootstrap/dist/js/bootstrap.min.js`,
    `node_modules/bootstrap-select/dist/js/bootstrap-select.min.js`,
  ], `${jsDestinationPath}/bootstrap.js`)
  .scripts([
    // -- TinyMCE editor --
    `node_modules/tinymce/tinymce.js`,
    `node_modules/tinymce/themes/modern/theme.js`,
    `node_modules/tinymce/plugins/image/plugin.js`,
    `node_modules/tinymce/plugins/imagetools/plugin.js`,
    `node_modules/tinymce/plugins/paste/plugin.js`,
    `node_modules/tinymce/plugins/textcolor/plugin.js`,
    `node_modules/tinymce/plugins/colorpicker/plugin.js`,
    `node_modules/tinymce/plugins/lists/plugin.js`,
    `node_modules/tinymce/plugins/autolink/plugin.js`,
    `node_modules/tinymce/plugins/link/plugin.js`,
    `node_modules/tinymce/plugins/advlist/plugin.js`,
    `${assetsPath}js/plugins/**/*.js`,
  ],`${jsDestinationPath}/tinymce.js`)
  .scripts([
    `node_modules/underscore/underscore.js`,
    `node_modules/jquery/dist/jquery.min.js`,
    `node_modules/jquery-ui/jquery-ui.min.js`,
    `node_modules/bootstrap/dist/js/bootstrap.min.js`,
    `node_modules/magnific-popup/dist/jquery.magnific-popup.js`,
    `node_modules/cropit/dist/jquery.cropit.js`,
    `node_modules/bootstrap-select/dist/js/bootstrap-select.min.js`,
    `node_modules/noty/js/noty/packaged/jquery.noty.packaged.js`,
    // -- Jquery Simple colorpicker List --
    `node_modules/jquery-simplecolorpicker/jquery.simplecolorpicker.js`,
    // -- TinyMCE editor --
    `node_modules/tinymce/tinymce.js`,
    `node_modules/tinymce/themes/modern/theme.js`,
    `node_modules/tinymce/plugins/paste/plugin.js`,
    `node_modules/tinymce/plugins/textcolor/plugin.js`,
    `node_modules/tinymce/plugins/colorpicker/plugin.js`,
    `node_modules/tinymce/plugins/lists/plugin.js`,
    `node_modules/tinymce/plugins/autolink/plugin.js`,
    `node_modules/tinymce/plugins/link/plugin.js`,
    `node_modules/tinymce/plugins/advlist/plugin.js`,
    `node_modules/zxcvbn/dist/zxcvbn.js`,
    `node_modules/tinymce/plugins/noneditable/plugin.js`,
    // -- Vue --
    `node_modules/vue/dist/vue.min.js`,
    // -- Extended plugins --
    `${assetsPath}js/plugins/**/*.js`,
    // -- Common scripts --
    `${assetsPath}js/library/helpers/*.js`,
    `${assetsPath}js/library/custom-plugins/html2canvas-0.5.0-modified.js`, // include always after application-utils.js
    `${assetsPath}js/library/application-globals.js`,
    `${assetsPath}js/library/application-utils.js`,
    `${assetsPath}js/library/application-init.js`,
    `${assetsPath}js/library/application-api.js`,
    `${assetsPath}js/library/login.js`
  ], `${jsDestinationPath}/library.js`)
  .scripts([
    `${assetsPath}js/library/application-proof.js`,
  ], `${jsDestinationPath}/dashboard-proof.js`)
  .scripts([
    `${assetsPath}js/library/custom-plugins/st-pagination-bar.jquery.js`,
    `${assetsPath}js/library/campaign-preview.js`,
    `${assetsPath}js/library/campaign-manager.js`,
    `${assetsPath}js/library/campaign-controller.js`,
    `${assetsPath}js/library/dashboard-controller.js`,
    assetsPath + jsAppFilePath('vue/dashboard.js'),
    assetsPath + jsAppFilePath('dashboard.js'),
  ], `${jsDestinationPath}/dashboard.js`)
  .scripts([
    assetsPath + jsAppFilePath('proof.js'),
  ], `${jsDestinationPath}/proof.js`)
  .scripts([
    `${assetsPath}js/library/custom-plugins/st-pagination-bar.jquery.js`,
    `${assetsPath}js/library/admin/*.js`,
    assetsPath + jsAppFilePath('admin.js'),
  ], `${jsDestinationPath}/admin.js`)
  .scripts([
  	// Transformers
    `${assetsPath}js/library/transformers.js`,
    // Custom Plugins
    `${assetsPath}js/library/custom-plugins/st-pagination-bar.jquery.js`,
    `${assetsPath}js/library/custom-plugins/st-color-picker.js`,
    // Configuration Modals [ Deprecated ]
    `${assetsPath}js/library/modals/*`,
    // Library
    `${assetsPath}js/library/image-library.js`,
    `${assetsPath}js/library/master-image-editor.js`,
    `${assetsPath}js/library/master-image-editor.v2.js`,
    `${assetsPath}js/library/master-button-editor.js`,
    `${assetsPath}js/library/campaign-preview.js`,
    `${assetsPath}js/library/module-manager.js`,
    `${assetsPath}js/library/modal-manager.js`,
    `${assetsPath}js/library/campaign-menu.js`,
    `${assetsPath}js/library/image-manager.js`,
  ], `${jsDestinationPath}/campaign.js`)
  .scripts([
    `${assetsPath}js/library/custom-plugins/st-pagination-bar.jquery.js`,
    `${assetsPath}js/library/admin/*.js`,
    assetsPath + jsAppFilePath('admin.js'),
  ], `${jsDestinationPath}/admin.js`)
  .scripts([
    `node_modules/jquery/dist/jquery.min.js`,
    `node_modules/jquery-ui/jquery-ui.min.js`,
    `node_modules/bootstrap/dist/js/bootstrap.min.js`,
    assetsPath + jsAppFilePath('preview.js')
  ], `${jsDestinationPath}/preview.js`)
  .version()
  //.sourceMaps()
  .copyDirectory(`node_modules/tinymce/plugins/textcolor`, './public/build/js/plugins/tinymce/plugins/textcolor')
  // Bootstrap colorpicker
  // jQuery UI
  .copyDirectory(`node_modules/jquery-ui/themes/base/images`, 'public/css/images/jquery-ui')
  // TinyMCE
  .copyDirectory(`node_modules/tinymce/skins`, 'public/css/tinymce')
  .copyDirectory(`node_modules/tinymce/plugins/textcolor`, 'public/js/plugins/tinymce/plugins/textcolor')
  // Customer Assets if needed
  // .copyDirectory(`${customerAssetsPath}/images`, 'public/images/customer')
  // .copyDirectory(`${customerAssetsPath}/fonts`, 'public/fonts')
  .copyDirectory(`public/fonts`, 'public/build/fonts')
  //.copyDirectory(`public/images`, 'public/build/images')
  .copyDirectory('node_modules/element-ui/lib/theme-chalk/fonts', 'public/build/css/fonts')
  .then(function () {
    const fileToEdit = './public/build/rev-manifest.json';
    fs.readFile(fileToEdit, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      const lessBuildPath = data.replace(/\/build\//g, '');
      const lessCssPath = lessBuildPath.replace(/\/css\//g, '../css/')
      fs.writeFile(fileToEdit, lessCssPath, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    })})
  ;

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
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
