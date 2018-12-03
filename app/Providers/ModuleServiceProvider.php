<?php

namespace Stensul\Providers;

use Illuminate\Support\ServiceProvider;
use ModelKeyManager;
use ModuleModel as Module;

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
        self::$module_dir = base_path() . DS . 'stensul' . DS . 'customer' . DS . 'resources' . DS . 'assets' . DS . 'vue' . DS . 'modules';
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
    * @param string $status Module status
    * @param string $type Module type, null, "custom", "studio"
    * @return array
    */
    public static function getModuleList($status = null, $type = null)
    {
         $modules = [];


        if (is_null($type) || $type === 'custom') {
            // Load from module folder
            $files = \File::allFiles(self::$module_dir);

            foreach ($files as $file) {
                if ($file->isFile() && $file->getFilename() === 'config.json') {
                    $config = json_decode(file_get_contents($file->getPathName()));
                    $module_key = $config->key;
                    if (isset($config->enabled) && $config->enabled === true) {
                        $modules[$module_key] = $config;
                        $module = new Module(['key' => $module_key]);
                        $libraries = $module->getLibraries();
                        $modules[$module_key] = json_decode(json_encode($modules[$module_key]), true);
                        $modules[$module_key]['libraries'] = [];
                        foreach ($libraries as $library) {
                            $modules[$module_key]['libraries'][] = $library->name;
                        }
                        $modules[$module_key] = (object) $modules[$module_key];
                    }
                }
            }
        }

        if (is_null($type) || $type === 'studio') {
            // Load modules form Db.
            switch ($status) {
                case 'publish':
                    $modules_db = Module::published()->get();
                    break;
                case 'draft':
                    $modules_db = Module::draft()->get();
                    break;
                default:
                    $modules_db = Module::all();
            }

            foreach ($modules_db as $module) {
                $modules[$module->key] = $module->toArray();
                $libraries = $module->getLibraries();
                $modules[$module->key]['libraries'] = [];
                foreach ($libraries as $library) {
                    $modules[$module->key]['libraries'][] = $library->name;
                }
                $modules[$module->key] = (object) $modules[$module->key];
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

        // Try custom module
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
