<?php

namespace Stensul\Providers;

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

        foreach ($array2 as $key => &$value) {
            if (isset($value['override']) && $value['override']) {
                $merged[$key] = $value;
            } else {
                if (is_array($value) && isset($merged [$key]) && is_array($merged [$key])) {
                    $merged [$key] = self::arrayMergeRecursiveDistinct($merged [$key], $value);
                } else {
                    $merged [$key] = $value;
                }
            }
        }

        return $merged;
    }

    /**
     * Validate View.
     *
     * @param string $view
     * @param bool   $force
     *
     * @return string view path
     */
    public static function validateView($view, $force = true)
    {
        $app_name = strtolower(trim(env('APP_NAME', 'base')));
        $base_name = 'base';
        $view_render = $view;
        $view_path = explode('.', str_replace('/', '.', $view));
        $libraries = \Config::get("view.libraries", []);

        if ($app_name != $base_name && $force) {
            if (in_array($app_name, $view_path)) {
                $view_render = implode('.', $view_path);
            } elseif (in_array($base_name, $view_path)) {
                $view_gen_app = implode(
                    '.',
                    array_replace($view_path, [ array_search($base_name, $view_path) => $app_name ])
                );

                $view_gen_module_app = $app_name.".".implode('.', $view_path);

                if (\View::exists($view_gen_app)) {
                    $view_render = $view_gen_app;
                } elseif (\View::exists($view_gen_module_app)) {
                    $view_render = $view_gen_module_app;
                } else {
                    $view_render = implode('.', $view_path);
                }

            } else {
                $view_gen_base = $base_name.".".implode('.', $view_path);
                $view_gen_app = $app_name.".".implode('.', $view_path);
                $view_gen_module_app = $app_name.".".$base_name.".".implode('.', $view_path);

                if (\View::exists($view_gen_module_app)) {
                    $view_render = $view_gen_module_app;
                } elseif (\View::exists($view_gen_app)) {
                    $view_render = $view_gen_app;
                } elseif (\View::exists($view_gen_base)) {
                    $view_render = $view_gen_base;
                }
            }
        }

        if (!\View::exists($view_render)) {
            $value = null;
            foreach ($libraries as $key => $value) {
                if (strpos($view_render, $key) !== false) {
                    if ($key == "default") {
                        $view_default_app = str_replace("default.", "", $view_render);
                        $view_default = str_replace($app_name, $base_name, str_replace($key.".", '', $view_render));

                        if (\View::exists($view_default_app)) {
                            $view_render = $view_default_app;
                        } elseif (\View::exists($view_default)) {
                            $view_render = $view_default;
                        }
                    } else {
                        $view_render = str_replace($key.".", '', $view_render);
                    }
                }
            }
        }

        if (!\View::exists($view_render)) {
            $view_base = str_replace($app_name, $base_name, $view_render);

            if (\View::exists($view_base)) {
                $view_render = $view_base;
            } else {
                $view_render = str_replace("default.", "", $view_render);
            }
        }

        return $view_render;
    }

    /**
     *
     * get api driver by libraries
     *
     * @param string $library
     *
     * @return array
     */
    public static function getApiDrivers($library = null)
    {
        $configuration = \Config::all();
        $user_libraries = \Auth::user()->getLibraries();
        $api_drivers = [];

        if (is_null($library)) {
            if (isset($configuration["api"]["upload_modal"]) && $configuration["api"]["upload_modal"]) {
                $api_drivers[] = $configuration["api"]["api_driver"];
            } else {
                if ($configuration["view"]["campaign_format"] == "libraries") {
                    foreach ($configuration["view"]["libraries"] as $key => $libraries) {
                        if (isset($libraries["api_connection"])
                            && $libraries["api_connection"] !== false
                            && $key != "default"
                            && in_array($key, $user_libraries)) {
                            $api_drivers[] = $libraries["api_connection"];
                        }
                    }
                } else {
                    if (isset($configuration["view"]["libraries"]["default"])
                        && isset($configuration["view"]["libraries"]["default"]["api_connection"])
                        && $configuration["view"]["libraries"]["default"]["api_connection"] !== false ) {
                        $api_drivers[] = $configuration["view"]["libraries"]["default"]["api_connection"];
                    }
                }
            }
        } else {
            if (isset($configuration["view"]["libraries"][$library])
                && isset($configuration["view"]["libraries"][$library]["api_connection"])
                && $configuration["view"]["libraries"][$library]["api_connection"] !== false
                && ( in_array($library, $user_libraries) || $library == "default") ) {
                $api_drivers[] = $configuration["view"]["libraries"][$library]["api_connection"];
            } elseif (isset($configuration["api"]["upload_modal"]) && $configuration["api"]["upload_modal"]) {
                $api_drivers[] = $configuration["api"]["api_driver"];
            }
        }

        return array_unique($api_drivers);
    }
}
