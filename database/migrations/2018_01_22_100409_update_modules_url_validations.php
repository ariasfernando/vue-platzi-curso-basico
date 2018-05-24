<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;

class UpdateModulesUrlValidations extends Migration
{
    /**
     * This is a sample migration to change module structure on existing campaigns.
     *
     * @return void
     */
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
                            if (isset($component_value['type'])) {
                                if ($component_value['type'] === 'text-element' || $component_value['type'] === 'button-element') {
                                    if (isset($component_value['plugins'])) {
                                        foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                            if ($plugin_name === 'textOptions') {
                                                if (!isset($plugin['config']['settings'])) {
                                                    $custom_settings = [
                                                        'link_validate_url' => [
                                                           'title' => 'Validate Url',
                                                           'value' => false
                                                        ]
                                                    ];

                                                    $module_structure['columns'][$column_key]['components'][$component_key]
                                                                     ['plugins'][$plugin_name]['config']['settings'] = $custom_settings;
                                                }
                                            }
                                        }
                                    }
                                }

                                if ($component_value['type'] === 'image-element' || $component_value['type'] === 'button-element') {
                                    if (isset($component_value['plugins'])) {
                                        foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                            if ($plugin_name === 'destinationUrl') {
                                                if (isset($plugin['config']['required'])) {
                                                    if (isset($plugin['config']['validations'])) {
                                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                         ['plugins'][$plugin_name]['config']['validations']['required'] = $plugin['config']['required'];

                                                        unset($module_structure['columns'][$column_key]['components'][$component_key]
                                                                               ['plugins'][$plugin_name]['config']['required']);
                                                    } else {
                                                        $validations = [
                                                            'required' => true,
                                                            'url' => false
                                                        ];

                                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                      ['plugins'][$plugin_name]['config']['validations'] = $validations;
                                                    }
                                                }
                                            }
                                        }
                                    }
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

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Implement the code to reverse the migration here if needed.
    }
}
