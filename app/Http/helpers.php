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
         return Locale::getTranslation($string, $params);
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
         return Locale::getImagesPath($string);
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
         return Locale::getCssPath($string);
    }
}
