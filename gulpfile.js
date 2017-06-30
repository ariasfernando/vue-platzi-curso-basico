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
let gutil = require('gulp-util');
let fs = require('fs');
let data = require('gulp-data');
let fm = require('front-matter');
let path = require('path');
let gulpsync = require('gulp-sync')(gulp);

require('elixir-jshint');
require('laravel-elixir-vueify');

let mocha = require('gulp-mocha');
let generateSuite = require("gulp-mocha-browserify-sweet");
let browserify = require("gulp-browserify");
let concat = require("gulp-concat");

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
    try {
        fs.accessSync('resources/assets/js/' + appName + '/' + file, fs.F_OK);
        return 'js/' + appName + '/' + file;
    } catch (e) {
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

if (elixir.config.babel) {
    elixir.config.babel.enabled = false;
}

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
 | Scripts task
 | --------------------------------------------------------------------------
 */
gulp.task('elixir-scripts', function () {
    let assetsPath = 'resources/assets/';
    let jsDestinationPath = 'public/js/';

    elixir((mix) => {
        mix
            .browserify(
                "js/vue/campaign.js",
                jsDestinationPath + "campaign-components.js",
                assetsPath
            )
            .browserify(
                "js/vue/studio-library.js",
                jsDestinationPath + "studio-library.js",
                assetsPath
            )
            .browserify(
                "js/vue/studio-module.js",
                jsDestinationPath + "studio-module.js",
                assetsPath
            )
            .browserify(
                [
                    "js/vue/dashboard.js",
                    'js/library/custom-plugins/st-pagination-bar.jquery.js',
                    'js/library/campaign-preview.js',
                    'js/library/campaign-manager.js',
                    'js/library/campaign-controller.js',
                    'js/library/dashboard-controller.js'
                ],
                jsDestinationPath + "dashboard-components.js",
                assetsPath
            )
            // === Compile Vendor and Application scripts to library.js ===
            .scripts(
                [
                    'bower/jquery/dist/jquery.js',
                    'bower/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js'
                    //'bower/bootstrap/dist/js/bootstrap.min.js',
                    //'bower/jquery-ui/jquery-ui.min.js',
                    //'bower/bootstrap-select/dist/js/bootstrap-select.min.js',
                    //'bower/noty/js/noty/packaged/jquery.noty.packaged.js',
                    // -- TinyMCE editor --
                    // 'bower/tinymce/tinymce.js',
                    // 'bower/tinymce/themes/modern/theme.js',
                    // 'bower/tinymce/plugins/paste/plugin.js',
                    // 'bower/tinymce/plugins/textcolor/plugin.js',
                    // 'bower/tinymce/plugins/colorpicker/plugin.js',
                    // 'bower/tinymce/plugins/lists/plugin.js',
                    // 'bower/tinymce/plugins/autolink/plugin.js',
                    // 'bower/tinymce/plugins/link/plugin.js',
                    // 'bower/tinymce/plugins/advlist/plugin.js',
                    // -- Common scripts --
                    //'js/library/application-globals.js',
                    //'js/library/application-utils.js'
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

            // === Plugins ===
            .scripts(
                ['js/plugins/*.js', 'js/plugins/**/*.js'],
                jsDestinationPath + 'plugins.js',
                assetsPath
            )

            // === Modules ===
            .scripts(
                ['../views/base/modules/**/*.js', 'js/library/modules-placeholder.js'],
                jsDestinationPath + 'modules.js',
                assetsPath
            )

            // === Dashboard page ===
            .scripts(
                [
                    'js/library/custom-plugins/st-pagination-bar.jquery.js',
                    'js/library/campaign-preview.js',
                    'js/library/campaign-manager.js',
                    'js/library/campaign-controller.js',
                    'js/library/dashboard-controller.js',
                    jsAppFilePath('dashboard-vue.js'),
                    jsAppFilePath('dashboard.js')
                ],
                jsDestinationPath + 'dashboard.js',
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
                    'js/library/campaign-preview.js',
                    'js/library/module-manager.js',
                    'js/library/modal-manager.js',
                    'js/library/campaign-manager.js',
                    'js/library/campaign-menu.js',
                    'js/library/image-manager.js',
                    jsAppFilePath('campaign.js')
                ],
                jsDestinationPath + 'campaign.js',
                assetsPath
            )
            // === Campaign Preview page ===
            .scripts(
                [
                    "bower/jquery/dist/jquery.min.js",
                    "bower/jquery-ui/jquery-ui.min.js",
                    "bower/bootstrap/dist/js/bootstrap.min.js",
                    jsAppFilePath("preview.js")
                ],
                jsDestinationPath + "preview.js",
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
        mix.less( appName + '/base-v2/base.less');
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
            'css/base.css',
            'js'
        ]);
    });
});

/*
 | --------------------------------------------------------------------------
 | Custom tasks
 | --------------------------------------------------------------------------
 */
gulp.task('st-custom-tasks', () => {
    gulp.watch(['resources/views/**/layouts/partials/*.blade.php'], ['validate-fonts']);
});

gulp.task('validate-fonts', () => {
    return gulp.src('resources/views/**/layouts/partials/*.blade.php')
        .pipe(data((file) => {
            // Get file content
            let content = fm(String(file.contents));
            let fileName = path.basename(file.path);

            // Find font lines
            let fontLinesRegex = /\/fonts\/.+/g;
            let fontLinesMatches = content.body.match(fontLinesRegex);

            let fontFamilyRegex = /\.(eot|woff|svg|ttf|woff2)(;?)/g;

            if ( fontLinesMatches ) {
                fontLinesMatches.forEach((match) => {
                    // Find extension
                    let extMatch = match.match(fontFamilyRegex);

                    if (!extMatch) {
                        gutil.log(gutil.colors.red('Missing or bad extension in'), gutil.colors.cyan(fileName), gutil.colors.white.bgRed(' - ' + match));
                    }
                });
            }
        }))
});

/*
 | --------------------------------------------------------------------------
 | Gulp Tasks
 | --------------------------------------------------------------------------
 */
gulp.task('jshint', ['elixir-jshint']);
gulp.task('watch', gulpsync.sync(['st-custom-tasks', 'elixir-less', 'elixir-scripts','elixir-copy-bower','elixir-version']));
gulp.task('default', gulpsync.sync(['validate-fonts', 'elixir-less', 'elixir-scripts','elixir-copy-bower','elixir-version']));