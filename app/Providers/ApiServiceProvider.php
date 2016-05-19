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
     * @param string $api_provider
     * @throws Exception
     * @return \Stensul\Services\Api\Eloqua|\Stensul\Services\Api\Responsys
     */
    public static function driver($api_provider)
    {
        $class_name = 'Stensul\\Services\\Api\\'.ucwords($api_provider);

        if (class_exists($class_name)) {
            try {
                return \App::make($class_name);
            } catch (Exception $e) {
                throw $e;
            }
        }
    }
}
