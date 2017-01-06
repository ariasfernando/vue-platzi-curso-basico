<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{

    private static $app_name;
    private static $module_dir;

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        self::$app_name = app('config')->get('app.name');
        self::$module_dir = app()->resourcePath() . DS . 'views' . DS . self::$app_name . DS . 'modules';
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

    /**
    * Get all modules config.
    *
    * @return array
    */
    public static function getModuleList()
    {

         $files = \File::allFiles(self::$module_dir);

         // Get legacy modules.
         $modules = \Config::get('modules');

         // Find new modules.
        foreach ($files as $file) {
            if ($file->isFile() && $file->getFilename() === 'config.json') {
                 $config = json_decode(file_get_contents($file->getPathName()), true);
                 $modules[$config['module_id']] = $config;
            }
        }
        ksort($modules);
        return $modules;
    }

    /**
    * Get module by id.
    *
    * @param string Module id in config.
    * @return mixed array or false
    */
    public static function getModule($module_id)
    {

        $modules = \Config::get('modules');

        // Try legacy module first.
        if (!empty($modules[$module_id])) {
            return $modules[$module_id];
        }

        return json_decode(file_get_contents(self::$module_dir . DS . $module_id . DS . 'config.json'), true);
    }

    /**
    * Create new module
    * @param array $params
    * @return int Exit code
    */
    public static function create($params)
    {
        return \Artisan::call('module:create', $params);
    }
}
