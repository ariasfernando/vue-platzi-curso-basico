<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;

class UpdateDestinationUrlModules extends Migration
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

                                                $custom_settings = [
                                                    'link_validate_url' => [
                                                       'title' => 'Validate URL',
                                                       'value' => 'disabled',
                                                       'type'  => 'select',
                                                       'options' => [
                                                           'disabled' => 'No Validation',
                                                           'url' => 'Validate Format',
                                                           'urlAndDestination' => 'Format and Destination'
                                                       ],
                                                       'content' => 'disabled'
                                                    ]
                                                ];

                                                if (!isset($plugin['config']['settings'])) {
                                                    $module_structure['columns'][$column_key]['components'][$component_key]
                                                                     ['plugins'][$plugin_name]['config']['settings'] = $custom_settings;
                                                } else {
                                                    
                                                    if(!isset($plugin['config']['settings']['link_validate_url'])){
                                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                         ['plugins'][$plugin_name]['config']['settings']['link_validate_url'] = $custom_settings['link_validate_url'];
                                                    } elseif(!isset($plugin['config']['settings']['link_validate_url']['options'])){
                                                        // need to update to new structure
                                                        $updateSettings = $custom_settings['link_validate_url'];
                                                        if($plugin['config']['settings']['link_validate_url']['value'] === true){
                                                            $updateSettings['value'] = 'url';
                                                            $updateSettings['content'] = 'url';
                                                        } 
                                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                         ['plugins'][$plugin_name]['config']['settings']['link_validate_url'] = $updateSettings;
                                                                         
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if ($component_value['type'] === 'image-element' || $component_value['type'] === 'button-element') {
                                    if (isset($component_value['plugins'])) {
                                        foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                            if ($plugin_name === 'destinationUrl') {

                                                $urlSetting = [
                                                    'selected' => 'disabled',
                                                    'options' => [
                                                        'disabled'          => 'No Validation',
                                                        'url'               => 'Validate Format',
                                                        'urlAndDestination' => 'Format and Destination'
                                                        ]
                                                    ];

                                                if (isset($plugin['config']['validations'])){
                                                    if(isset($plugin['config']['validations']['url']) && $plugin['config']['validations']['url'] === true){

                                                        $urlSetting['selected'] = 'url';

                                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                            ['plugins'][$plugin_name]['config']['validations']['url'] = $urlSetting;

                                                    } elseif(isset($plugin['config']['validations']['url']) && $plugin['config']['validations']['url'] === false) {
                                                        $module_structure['columns'][$column_key]['components'][$component_key]
                                                                        ['plugins'][$plugin_name]['config']['validations']['url'] = $urlSetting;
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
        //
    }
}
