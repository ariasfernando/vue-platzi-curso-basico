<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Stensul\Models\Module;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log as Logging;

class AddLinkFormatSetting extends Migration
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
        $this->setModulesTextOptionsLinkFormat();
    }

    protected function setModulesTextOptionsLinkFormat() {
        $modules = Module::all();
        Logging::info('-------------------------');
        Logging::info('MODULES');
        Logging::info('-------------------------');
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
                                                if (!isset($plugin['config']['settings']['link_format'])) {
                                                    $module_structure['columns'][$column_key]['components'][$component_key]['plugins'][$plugin_name]['config']['settings']['link_format'] = array(
                                                        'content' => array(
                                                            'bold' => false,
                                                            'underline' => false
                                                        )
                                                    );
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
