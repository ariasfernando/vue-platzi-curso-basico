<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @see \Illuminate\Support\ServiceProvider::register()
     * @return void
     */
    public function register()
    {
        //
    }

    public static function getModuleList()
    {
         $app_name = app('config')->get('app.name');
         $module_dir = app()->resourcePath() . DS . 'views' . DS . $app_name . DS . 'modules';
         $files = \File::allFiles($module_dir);

         // Get legacy modules.
         $modules = \Config::get('modules');

         // Find new modules.
        foreach ($files as $file) {
            if ($file->isFile() && $file->getFilename() === 'config.json') {
                 $config = json_decode(file_get_contents($file->getPathName()), true);
                 $modules[$config['type']] = $config;
            }
        }

        return $modules;
    }
}
