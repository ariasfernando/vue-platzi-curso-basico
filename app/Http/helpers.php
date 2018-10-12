<?php

if (!function_exists('_l')) {
    /**
     * Get translation for text
     *
     * @param  string  $string
     * @return string
     */
    function _l($string = null, $params = array())
    {
         return StensulLocale::getTranslation($string, $params);
    }
}

if (!function_exists('image')) {
    /**
     * Get image path according to the language
     *
     * @param  string  $string
     * @return string path
     */
    function image($string = null)
    {
         return StensulLocale::getImagesPath($string);
    }
}

if (!function_exists('css')) {
    /**
     * Get css path according to the language
     *
     * @param  string  $string
     * @return string
     */
    function css($string = null)
    {
         return StensulLocale::getCssPath($string);
    }
}

if (!function_exists('cdn')) {
    /**
     * Generate a url for the CDN.
     *
     * @param  string  $path
     * @return string
     */
    function cdn($path = null)
    {
        return \config::get('view.suite_cdn_host') . $path;
    }
}

if (!function_exists('getCssContent')) {
    /**
     * Wraps a css in a media query .
     *
     * @param  string  $filename
     * @return string
     */
    function getCssContent($filename)
    {
        try
        {
            return Storage::disk('local:public')->get($filename);
        }
        catch (Illuminate\Contracts\Filesystem\FileNotFoundException $e)
        {
            Activity::log("The file doesn't exist: " . $e->getMessage());
        }
    }
}
