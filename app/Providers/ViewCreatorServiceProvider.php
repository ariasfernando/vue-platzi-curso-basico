<?php

namespace Stensul\Providers;

use Auth;
use View;
use Illuminate\Support\ServiceProvider;
use Stensul\Providers\ModuleServiceProvider;

class ViewCreatorServiceProvider extends ServiceProvider
{
    private static $app_name;

    /**
     * Register bindings in the container.
     */
    public function boot()
    {
        self::$app_name = app('config')->get('app.name');

        // Share to module views
        View::creator(
            ['base/modules/*',  self::$app_name . '/modules/*'],
            function ($view) {

                $modules_path = [app()->resourcePath() . DS . 'views' . DS . 'base' . DS . 'modules'];

                if (self::$app_name != 'base') {
                    $modules_path[] = app()->resourcePath() . DS . 'views' . DS . self::$app_name . DS . 'modules';
                }

                // Only parse module templates.
                if (in_array(dirname($view->getPath()), $modules_path)
                    && substr($view->getPath(), -28) !== 'module_constructor.blade.php') {
                    $template = file_get_contents($view->getPath());
                    $matches = [];
                    preg_match_all("/\{\{([\$a-z0-9_]+)(\s+or\s+[\'\"](.*?)[\'\"])?\}\}/i", $template, $matches);
    
                    if (!empty($matches[1])) {
                        foreach ($matches[1] as $key => $variable) {
                            // Assign empty string if there's no default value for the variable.
                            // {{$the_variable or 'the default'}}
                            if (empty($matches[3][$key])) {
                                $view->with(substr($variable, 1), '');
                            }
                        }
                    }
                }
            }
        );
    }

    /**
     * Register.
     */
    public function register()
    {
        //
    }
}
