<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class CdnServiceProvider extends ServiceProvider
{
    /**
 * Set cdn provider or use default and instance it.
 *
 * @return object instance of a cdn provider
 *
 * @throws \Exception
 */
    public static function disk($cdn = null)
    {
        $cdn_provider = $cdn ?: \Config::get('cdn.default');

        $config = \Config::get('cdn.providers.'.$cdn_provider);

        $class_name = 'Stensul\\Providers\\Cdn\\'.$config['adapter'];

        if (class_exists($class_name)) {
            try {
                return new $class_name($config);
            } catch (Exception $e) {
                throw $e;
            }
        }
    }

    /**
     * Boot.
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
}
