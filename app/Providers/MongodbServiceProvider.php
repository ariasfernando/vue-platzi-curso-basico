<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

use Jenssegers\Mongodb\Model;
use Stensul\Providers\MongoDb\Connection;

class MongodbServiceProvider extends \Jenssegers\Mongodb\MongodbServiceProvider
{

    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot()
    {
        Model::setConnectionResolver($this->app['db']);

        Model::setEventDispatcher($this->app['events']);
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->resolving('db', function ($db) {
        
            $db->extend('mongodb', function ($config) {
            
                return new Connection($config);
            });
        });
    }
}
