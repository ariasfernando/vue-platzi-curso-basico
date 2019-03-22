<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        $socialite = $this->app->make('Laravel\Socialite\Contracts\Factory');
        $socialite->extend(
            'okta',
            function($app) use ($socialite) {
                $config = $app['config']['services.okta'];
                return $socialite->buildProvider(\Stensul\Socialite\Okta\OktaProvider::class, $config);
            }
        );
        \CampaignModel::observe(\Stensul\Observers\CampaignObserver::class);
    }

    /**
     * Register any application services.
     *
     * This service provider is a great spot to register your various container
     * bindings with the application. As you can see, we are registering our
     * "Registrar" implementation here. You can add your own bindings too!
     */
    public function register()
    {
        require_once __DIR__ . '/../Http/helpers.php';

        $this->app->bind(
            Illuminate\Contracts\Auth\Registrar::class
        );
    }
}
