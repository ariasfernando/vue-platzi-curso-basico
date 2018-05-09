<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class ApiServiceProvider extends ServiceProvider
{
    protected $defer = true;

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('Stensul\Services\Api\Eloqua', function () {
            return new \Stensul\Services\Api\Eloqua();
        });

        $this->app->singleton('Stensul\Services\Api\Responsys', function () {
            return new \Stensul\Services\Api\Responsys();
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }

    /**
     * Driver
     *
     * @param string $api_provider
     * @param array  $options
     * @throws Exception
     * @return Api Service
     */
    public static function driver($api_provider, $options = [])
    {
        $api_class = ucwords($api_provider);
        $core_class = "Stensul\\Services\\Api\\$api_class";
        $package_class = "Stensul\\Esp\\$api_class\\$api_class";
        if (class_exists($package_class)) {
            return app()->make($package_class);
        } elseif (class_exists($core_class)) {
            return app()->make($core_class, ['options' => $options]);
        }
    }
}
