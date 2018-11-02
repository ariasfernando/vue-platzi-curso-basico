<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;


class ChangePluginTitles extends Migration
{
    public function up()
    {
        // Make it faster by disabling query log.
        DB::connection()->disableQueryLog();

        $modules = Module::all();

        foreach ($modules as $key => &$module) {
            $module_structure = $module->structure;

            if (isset($module_structure) && isset($module_structure['columns'])) {
                foreach ($module_structure['columns'] as $column_key => $column_value) {
                    if (isset($column_value['components'])) {
                        foreach ($column_value['components'] as $component_key => $component_value) {
                            if (isset($component_value['plugins'])) {
                                foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                    if ($plugin_name === 'styleImageEditor') {
                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                ['plugins'][$plugin_name]['title'] = 'Image Editable';
                                    }
                                    if ($plugin_name === 'destinationUrl') {
                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                ['plugins'][$plugin_name]['title'] = 'Destination URL';
                                    }
                                }
                            }
                        }
                    }
                }

            $module->structure = $module_structure;
            $module->save();
            }
        }
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
