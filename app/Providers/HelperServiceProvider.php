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
     * Validate and Render View.
     *
     * @param string $view
     * @param bool   $force
     * @param array  $params
     *
     * @return string view path
     */
    public static function getRenderedView($view, $force = true, $params = [])
    {
        $view_path = self::validateView($view, $force);
        $view = \View::make($view_path);
        foreach ($params as $name => $param) {
            $view->with($name, $param);
        }

        return $view->render();
    }

    /**
     * get api driver by libraries
     *
     * @return array
     */
    public static function getApiDrivers()
    {
        $user_libraries = \Auth::user() ? \Auth::user()->getLibraries() : [];
        $api_drivers = [];

        foreach ($user_libraries as $library) {
            $library_config = Library::findOrFail($library['_id'])->config;
            if (isset($library_config['esp']) && $library_config['esp'] && $library_config['espProvider']) {
                $api_drivers[] = $library_config['espProvider'];
            }
        }

        return array_unique($api_drivers);
    }
}
