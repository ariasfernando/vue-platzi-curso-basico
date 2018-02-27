<?php

namespace Stensul\Providers;

use Stensul\Models\Library;
use Illuminate\Support\ServiceProvider;

class HelperServiceProvider extends ServiceProvider
{
    /**
     * Register custom helpers to use with blade views.
     */
    public function boot()
    {
    }

    /**
     * Register.
     *
     * @see \Illuminate\Support\ServiceProvider::register()
     */
    public function register()
    {
    }

    /**
     * Extract emails from string.
     *
     * @param string $text
     *
     * @return array emails or false
     */
    public static function parseEmails($text)
    {
        $IP_RegExp_Match = '\\[?[0-9]{1,3}(\\.[0-9]{1,3}){3}\\]?';
        $Host_RegExp_Match = '('.$IP_RegExp_Match.'|[0-9a-z]([-.]?[0-9a-z])*\\.[a-z][a-z]+)';
        $Email_RegExp_Match = '[0-9a-z]([-_.+]?[0-9a-z])*(%'.$Host_RegExp_Match.')?@'.$Host_RegExp_Match;

        preg_match_all('/'.$Email_RegExp_Match.'/i', $text, $regs);

        $addresses = array_merge(array_unique($regs[0]));

        return $addresses;
    }

    /**
     * Check if an array is associative.
     *
     * @param  Array $arr
     * @return boolean
     */
    public static function isAssoc(array $arr)
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    /**
     *
     * Array merge recursive
     *
     * @param array $array1
     * @param array $array2
     * @return array
     */
    public static function arrayMergeRecursiveDistinct(array &$array1, array &$array2)
    {
        $merged = $array1;
        /*
        This is for non associative arrays where we need to concat values,
        not override it.
        */
        if (!self::isAssoc($array1) && !isAssoc($array2)) {
            foreach ($array2 as $value) {
                if (!in_array($value, $merged)) {
                    $merged[] = $value;
                }
            }
            return $merged;
        }
        // If both are associative array override the keys.
        foreach ($array2 as $key => &$value) {
            if (isset($value['override']) && $value['override']) {
                $merged[$key] = $value;
            } else {
                if (is_array($value) && isset($merged [$key]) && is_array($merged[$key])) {
                    $merged [$key] = self::arrayMergeRecursiveDistinct($merged[$key], $value);
                } else {
                    $merged [$key] = $value;
                }
            }
        }

        return $merged;
    }

    /**
     * Get api drivers, optionally filtered by the given library Id.
     *
     * @param String $library_id Library Id (optional)
     * @return array
     */
    public static function getApiDrivers($library_id = null)
    {
        $user_libraries = \Auth::user() ? \Auth::user()->getLibraries() : [];
        $api_drivers = [];

        foreach ($user_libraries as $library) {
            $library_config = Library::findOrFail($library['_id'])->config;
            if (isset($library_config['esp']) && $library_config['esp'] && $library_config['espProvider']) {
                if (!$library_id || $library_id == $library['_id']) {
                    $api_drivers[] = $library_config['espProvider'];
                }
            }
        }

        return array_unique($api_drivers);
    }
}
