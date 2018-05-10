<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log as Logging;
use Stensul\Models\Library;

class FixCustomModuleKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Make it faster by disabling query log.
        DB::connection()->disableQueryLog();

        // Load from module folder
        $files = \File::allFiles(base_path() . DS . 'stensul' . DS . 'customer' . DS
        . 'resources' . DS . 'assets' . DS . 'vue' . DS . 'modules');

        // Collect custom module keys.
        Logging::info('Collecting custom modules');
        $custom_modules = [];
        foreach ($files as $file) {
            if ($file->isFile() && $file->getFilename() === 'config.json') {
                $config = json_decode(file_get_contents($file->getPathName()), true);

                $module_key = preg_replace(['/[^a-z0-9 _]/i', '/\s+/'], ['', '_'], strtolower($config['name']));
                $custom_modules[$module_key] = true;
            }
        }

        /*
         * Iterate through all the libraries
        */
        Library::withTrashed()->chunk(100, function ($libraries) use ($custom_modules) {
            Logging::info('Fetching libraries');
            foreach ($libraries as $library) {
                Logging::info("Library id: {$library->id}");
                $modules_keys = $library->modules;
                foreach ($library->modules as $key => $module) {
                    if (is_array($module)) {
                        foreach ($module as $index => $mod) {
                            if (isset($custom_modules[$mod])) {
                                $modules_keys[$key][$index] = $mod . '_custom';
                                Logging::info("Adding custom suffix to $mod");
                            }
                        }
                    } else {
                        if (isset($custom_modules[$module])) {
                            $modules_keys[$key] = $module . '_custom';
                            Logging::info("Adding custom suffix to $module");
                        }
                    }
                }

                $library->modules = $modules_keys;
                Logging::info("Saving library");
                $library->save();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
