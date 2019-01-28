<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Stensul\Models\Module;
use Stensul\Models\Campaign;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log as Logging;

class AddKeyToTextOptions extends Migration
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

        $this->setCampaignTextOptionsLinkKey();
        $this->setModulesTextOptionsLinkKey();
    }

    protected function setModulesTextOptionsLinkKey() {
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
                                                if (isset($plugin['config']['options']['link'])) {
                                                    $module_structure['columns'][$column_key]['components'][$component_key]['plugins'][$plugin_name]['config']['options']['link']['key'] = 'link';
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

    protected function setCampaignTextOptionsLinkKey() {
        Campaign::withTrashed()->chunk(100, function ($campaigns) {
            Logging::info('-------------------------');
            Logging::info('CAMPAIGNS');
            Logging::info('-------------------------');

            foreach ($campaigns as $campaign) {
                Logging::info('Campaign id= ' . $campaign->id);

                $modules_data = $campaign->modules_data;
                foreach ($campaign->modules_data as $key => $module) {
                    Logging::info('Module moduleId= ' . $module['name']);
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {
                        foreach ($module['structure']['columns'] as $column_key => $column_value) {
                            if (isset($column_value['components'])) {
                                foreach ($column_value['components'] as $component_key => $component_value) {
                                    if (isset($component_value['plugins'])) {
                                        foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                            if ($plugin_name === 'textOptions') {
                                                $component_id = isset($component_value['id']) ? $component_value['id'] : 'no-id';
                                                Logging::info('component id= ' . $component_id);
                                                $modules_data[$key]['structure']['columns'][$column_key]['components'][$component_key]
                                                ['plugins'][$plugin_name]['config']['options']['link']['key'] = 'link';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                $campaign->modules_data = $modules_data;
                $campaign->save();
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
