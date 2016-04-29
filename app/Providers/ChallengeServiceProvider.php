<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class ChallengeServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = true;

    /**
     * Set challenge provider or use default and instance it.
     *
     * @return object instance of a challenge provider
     *
     * @throws \Exception
     */
    public static function provider($challenge_provider = null)
    {
        $challenge_provider = $challenge_provider ?: \Config::get('challenge.default');
        $config = \Config::get('challenge.providers.'.$challenge_provider);

        $class_name = 'Stensul\\Providers\\Challenge\\'.$config['adapter'];

        if (class_exists($class_name)) {
            return new $class_name($config);
        }
        return false;
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
