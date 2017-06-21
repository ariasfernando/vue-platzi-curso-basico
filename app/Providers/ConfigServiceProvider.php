<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class ConfigServiceProvider extends ServiceProvider
{
    /**
     * Overwrite any vendor / package configuration.
     *
     * This service provider is intended to provide a convenient location for you
     * to overwrite any "vendor" or package configuration that you may want to
     * modify before the application handles the incoming request / command.
     */
    public function register()
    {

        $customerConfigPath = base_path() . DS . env('CUSTOMER_CONFIG_FOLDER', 'Stensul/Customer/Config/');
        
        if (\File::exists($customerConfigPath)) {
            // Run through all PHP files in the customer config directory.
            $files = \File::allFiles($customerConfigPath);            
            foreach ($files as $file) {
                $keyName = basename($file->getRealPath(), '.php');
                $oldValues = config($keyName);
                $newValues = require $file->getRealPath();
                // Replace any matching values in the old config with the new ones.
                config([$keyName => array_replace_recursive($oldValues, $newValues)]);
            }
        }
    }
}