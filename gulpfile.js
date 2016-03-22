/*
 | --------------------------------------------------------------------------
 | Define App name
 | --------------------------------------------------------------------------
 */
var fs = require("fs");
var fileEnv = fs.readFileSync('.env').toString().split("\n");
var configEnv = [];

for(var i=0;i<fileEnv.length;i++){
	if(fileEnv[i]){
		var envArray = fileEnv[i].split("=");
		configEnv[envArray[0]] = envArray[1];
	}
}

var appName = "base";
if( configEnv.APP_NAME ){
	appName = configEnv.APP_NAME.toLowerCase().replace("\r","");
}


/*
 | --------------------------------------------------------------------------
 | Include file from App path in case it exists, if not from Base path 
 | --------------------------------------------------------------------------
 */

function jsAppFilePath (file) {
    try {
        fs.accessSync('resources/assets/js/' + appName + '/' + file, fs.F_OK);
        return 'js/' + appName + '/' + file;
    } catch (e) {
        return 'js/base/' + file;
		}
}

/*
 | --------------------------------------------------------------------------
 | Requires
 | --------------------------------------------------------------------------
 */
var elixir = require("laravel-elixir");
var gulp = require("gulp");
var notify = require("gulp-notify");
var gulpsync = require("gulp-sync")(gulp);
require('elixir-jshint');

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

process.env.DISABLE_NOTIFIER = true;

elixir.config.cssOutput = "public/css";
elixir.config.sourcemaps = false;

if( elixir.config.babel ){
	elixir.config.babel.enabled = false;
}

/*
 | --------------------------------------------------------------------------
 | jsHint task
 | --------------------------------------------------------------------------
 */
gulp.task( "elixir-jshint", function() {
	elixir(function(mix) {
		mix.jshint([
			"resources/assets/js/**/*"
		]);
	});
});


/*
 | --------------------------------------------------------------------------
 | Vendor task
 | --------------------------------------------------------------------------
 */
gulp.task( "elixir-copy-bower", function() {
	var bowerPath = "resources/assets/bower/";

	elixir(function(mix) {
		mix
			// Bootstrap colorpicker
			.copy(bowerPath + "bootstrapcolorpicker/dist/img/bootstrap-colorpicker", "public/css/images/bootstrap-colorpicker")
			// jQuery UI
			.copy(bowerPath + "jquery-ui/themes/ui-lightness/images", "public/css/images/jquery-ui")
			// TinyMCE
			.copy(bowerPath + "tinymce/skins", "public/css/tinymce")
			.copy(bowerPath + "tinymce/plugins/textcolor", "public/js/plugins/tinymce/plugins/textcolor");
	});
});



/*
 | --------------------------------------------------------------------------
 | Scripts task
 | --------------------------------------------------------------------------
 */
gulp.task( "elixir-scripts", function() {
	var assetsPath = "resources/assets/";
	var jsDestinationPath = "public/js/";

	elixir(function(mix) {
		mix
			// === Compile Vendor and Application scripts to library.js ===
			.scripts(
				[
					"bower/jquery/dist/jquery.min.js",
					"bower/jquery-ui/jquery-ui.min.js",
					"bower/bootstrap/dist/js/bootstrap.min.js",
					"bower/magnific-popup/dist/jquery.magnific-popup.js",
					"bower/cropit/dist/jquery.cropit.min.js",
					"bower/bootstrapcolorpicker/dist/js/bootstrap-colorpicker.min.js",
					"bower/bootstrap-select/dist/js/bootstrap-select.min.js",
					// -- Jquery Simple colorpicker List --
					"bower/jquery-simplecolorpicker/jquery.simplecolorpicker.js",
					// -- TinyMCE editor --
					"bower/tinymce/tinymce.js",
					"bower/tinymce/themes/modern/theme.js",
					"bower/tinymce/plugins/paste/plugin.js",
					"bower/tinymce/plugins/textcolor/plugin.js",
					"bower/tinymce/plugins/colorpicker/plugin.js",
					'bower/tinymce/plugins/lists/plugin.js',
					'bower/tinymce/plugins/autolink/plugin.js',
					'bower/tinymce/plugins/link/plugin.js',
					'bower/tinymce/plugins/advlist/plugin.js',
					// -- Extended plugins --
					"js/plugins/**/*.js",
					// -- Common scripts --
					'js/library/custom-plugins/html2canvas-0.5.0-modified.js', // include always after application-utils.js
					"js/library/application-globals.js",
					"js/library/application-utils.js",
					"js/library/application-init.js",
                    "js/library/application-api.js",
					"js/library/login.js"
				],
				jsDestinationPath + "library.js",
				assetsPath
			)

			// === Dashboard page ===
			.scripts(
				[
					"js/library/custom-plugins/st-pagination-bar.jquery.js",
					"js/library/campaign-controller.js",
					"js/library/dashboard-controller.js",
					jsAppFilePath("dashboard.js")
				],
				jsDestinationPath + "dashboard.js",
				assetsPath
			)

			// === Admin page ===
			.scripts(
				[
					"js/library/custom-plugins/st-pagination-bar.jquery.js",
					"js/library/admin/user-controller.js",
					"js/library/admin/role-controller.js",
					"js/library/admin/permission-controller.js",
					"js/library/admin/log-controller.js",
					jsAppFilePath("admin.js")
				],
				jsDestinationPath + "admin.js",
				assetsPath
			)

			// === Campaign page ===
			.scripts(
				[
					// Transformers
					"js/library/transformers.js",
					// Custom Plugins
					"js/library/custom-plugins/st-pagination-bar.jquery.js",
					"js/library/custom-plugins/st-color-picker.js",
					// Configuration Modals
					"js/library/modals/*",
                    // Base Modules
                    "js/library/modules/*.js",
					// Library
					"js/library/image-library.js",
					"js/library/master-image-editor.js",
					"js/library/master-image-editor.v2.js",
					"js/library/master-button-editor.js",
					"js/library/module-manager.js",
					"js/library/modal-manager.js",
					"js/library/campaign-manager.js",
					"js/library/campaign-menu.js",
					"js/library/image-manager.js",
					jsAppFilePath("campaign.js")
				],
				jsDestinationPath + "campaign.js",
				assetsPath
			);
	});
});

/*
 | --------------------------------------------------------------------------
 | Compile LESS
 | --------------------------------------------------------------------------
 */
gulp.task("elixir-less", function() {
	elixir(function(mix) {
		mix.less( appName + "/*.less");
	});
});


/*
 | --------------------------------------------------------------------------
 | Elixir Version
 | --------------------------------------------------------------------------
 */
gulp.task("elixir-version", function() {
	elixir(function(mix) {
		mix.version([
			"css/admin.css",
			"css/base.css",
			"js/*"
		]);
	});
});


/*
 | --------------------------------------------------------------------------
 | Gulp Tasks
 | --------------------------------------------------------------------------
 */
gulp.task("jshint", ["elixir-jshint"]);
gulp.task("watch", gulpsync.sync(["elixir-less","elixir-scripts","elixir-copy-bower","elixir-version"]));
gulp.task("default", gulpsync.sync(["elixir-less","elixir-scripts","elixir-copy-bower","elixir-version"]));