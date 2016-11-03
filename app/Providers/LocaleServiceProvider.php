<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class LocaleServiceProvider extends ServiceProvider
{
    const COMMON_IMG_PATH = '/_common/images/';
    const COMMON_CSS_PATH = 'css/';

    public static $language_texts;
    public static $locale;

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Initialize setting the language translations
     *
     * @param string $locale
     * @param array $module, optional
     * @var string $module[name]
     * @var string $module[app_name]
     *
     * @return void
     */
    public static function init($locale = null, $module = array())
    {

        // Set locale
        self::$locale = !empty($locale) ? $locale : \Config::get('locale.locale_default');

        // Get base translation path
        $base_translation_path = \Config::get('locale.base_translation_path');

        // Load global translations
        $app_name = strtolower(env('APP_NAME'));
        self::$language_texts = [];
        if (file_exists($global_translations = $base_translation_path . $app_name . '/' . self::$locale . '.php')) {
            self::$language_texts = require($global_translations);
        }

        // Load particular module translations
        if (!empty($module)
            && isset($module['name'])
            && isset($module['app_name'])
            && file_exists($module_translations_path = $base_translation_path
                . $module['app_name'] . '/modules/' . $module['name'] . '/' . self::$locale . '.php')) {
            $module_texts = require($module_translations_path);
            self::$language_texts = array_merge(self::$language_texts, $module_texts);
        }

    }

    /**
     * Get translation for the text.
     *
     * @param string $string text to translate
     * @param array $params
     * @var string $params[key], optional
     * @var array $params[replace], optional. eg.: [replace => [placeholders, replacements] ]
     *
     * @return string text translated
     */
    public static function getTranslation($string = null, $params = array())
    {

        $code = isset($params['key']) ? $params['key'] : trim(($string));

        $string = isset(self::$language_texts[$code]) ? self::$language_texts[$code] : $string;
        
        if (isset($params['replace']) && count($params['replace']) == 2) {
            $string = str_replace($params['replace'][0], $params['replace'][1], $string);
        }

        return $string;
    }

    /**
     * Get common images path by language.
     *
     * @param string $image image name
     *
     * @return string image path
     */
    public static function getImagesPath($image)
    {
        
        $image_path = self::COMMON_IMG_PATH;
        
        if (file_exists(public_path() . $image_path . self::$locale  . '/' . $image)) {
            $image_path .= self::$locale  . '/' . $image;
        } else {
            $image_path .= '/en_us/' . $image;
        }

        return $image_path;
    }

    /**
     * Get common images path by language.
     *
     * @param string $css css name
     *
     * @return string css path
     */
    public static function getCssPath($css)
    {
       
        $css_path = self::COMMON_CSS_PATH;
       
        if (file_exists(public_path() . $css_path . self::$locale  . '/' . $css)) {
            $css_path .= self::$locale  . '/' . $css;
        } else {
            $css_path .= $css;
        }

        return $css_path;
    }
}
