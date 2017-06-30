<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    const ERROR_INVALID_MODULE_ID = 1;
    const ERROR_CREATING_MODULE_DIR = 2;
    const ERROR_CONFIG_FILE = 3;
    const ERROR_TEMPLATE_FILE = 4;
    const ERROR_PARENT_TEMPLATE = 5;
    const ERROR_DUPLICATE_MODULE_ID = 6;
    const ERROR_INVALID_JSON = 7;
    const ERROR_DELETING_TEMPLATE = 8;

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
        self::$module_dir = app()->resourcePath() . DS . 'views' . DS . 'modules';
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
    * TODO: Get dynamic modules from db
    */
    public static function getModuleList()
    {
         $modules = [];

         // Load from module folder
        $files = \File::allFiles(self::$module_dir);

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
        $module = [];
        
        // Try pkg module
        if (file_exists(self::$module_dir . DS . $module_id . DS . 'config.json')) {
            try {
                $module = json_decode(
                    file_get_contents(self::$module_dir . DS . $module_id . DS . 'config.json'),
                    true
                );
            } catch (Exception $e) {
            }
        } else {
            $modules = \Config::get('modules');

            // Try legacy module
            if (!empty($modules[$module_id])) {
                $module = $modules[$module_id];
            }
        }

        return $module;
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

    /**
    * Edit module
    * @param array $params
    * @return int Exit code
    */
    public static function edit($params)
    {
        $config = json_decode($params['config'], true);
        $config['module_id'] = $params['module_id'];
        $config['title'] = $params['name'];
        $config['description'] = $params['description'];
        $config['class'] = 'pkg';

        $module_dir = self::$module_dir . DS . $params['module_id'];
        if (!is_dir($module_dir)) {
            try {
                mkdir($module_dir, 0755, true);
            } catch (\Exception $exception) {
                return self::ERROR_CREATING_MODULE_DIR;
            }
        }
        // Save module configuration
        if (!self::saveConfig($module_dir, $config)) {
            return self::ERROR_CONFIG_FILE;
        }
        // Save module template
        if (!self::saveTemplate($module_dir, $params['template'])) {
            return self::ERROR_TEMPLATE_FILE;
        }

        // Check if is an old module
        $template_file = self::$module_dir . DS . $params['module_id'] . '.blade.php';

        if (file_exists($template_file)) {
            try {
                $template = file_get_contents($template_file);
                file_put_contents($module_dir . DS . 'template.blade.php', $template);
            } catch (\Exception $exception) {
                return self::ERROR_TEMPLATE_FILE;
            }

            // Delete old module template
            try {
                unlink($module_dir . '.blade.php');
            } catch (Exception $exception) {
                return self::ERROR_DELETING_TEMPLATE;
            }
        }
    }

    /**
    * Save module config
    * @param string $module_dir
    * @param array $config
    * @return int Exit code
    */
    public static function saveConfig($module_dir, $config)
    {
        return file_put_contents($module_dir . DS . 'config.json', json_encode($config, JSON_PRETTY_PRINT));
    }

    /**
    * Save module template
    * @param string $module_dir
    * @param array $template
    * @return int Exit code
    */
    public static function saveTemplate($module_dir, $template)
    {
        return file_put_contents($module_dir . DS . 'template.blade.php', $template);
    }


    /**
    * Get module template
    * @param string $module_dir
    * @return string html template
    */
    public static function getTemplate($module_id)
    {
        // Check if is an old module
        $template_file = self::$module_dir . DS . $module_id . '.blade.php';

        if (file_exists($template_file)) {
            try {
                $template = file_get_contents($template_file);
            } catch (\Exception $exception) {
            }
        } else {
            try {
                $template = file_get_contents(self::$module_dir . DS . $module_id . DS . 'template.blade.php');
            } catch (\Exception $exception) {
            }
        }
        return $template;
    }
}
