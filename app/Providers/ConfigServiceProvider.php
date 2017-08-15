<?php

namespace Stensul\Providers;

use Stensul\Models\Setting;
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
    public function boot()
    {
        $customerConfigPath = base_path() . DS . env('CUSTOMER_CONFIG_FOLDER', 'stensul/customer/config/');
        
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

        // Get global setting from DB
        $global_settings = [];
        foreach (Setting::all(['key', 'value'])->toArray() as $setting) {
            $global_settings[$setting['key']] = $setting['value'];
        }
        config(['global_settings' => $global_settings]);
    }

    public function register()
    {
        //
    }
}