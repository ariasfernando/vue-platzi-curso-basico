<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;
use Stensul\Models\Module;
use Illuminate\Support\Facades\Log as Logging;


class UpdatePalleteBackground extends Migration
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
        $this->setCampaignRenamePaletteBackgroundColor();
        $this->setModuleRenamePaletteBackgroundColor();
    }
        /*
         * Iterate through all campaigns
         * Get a bunch of campaigns at a time to save roundtrip times to the server.
        */

    protected function setCampaignRenamePaletteBackgroundColor() {
        Campaign::withTrashed()->chunk(100, function ($campaigns) {
            Logging::info('-------------------------');
            Logging::info('CAMPAIGNS');
            Logging::info('-------------------------');

            foreach ($campaigns as $campaign) {
                Logging::info('Campaign id= ' . $campaign->id);

                $modules_data = $campaign->modules_data;
                foreach ($campaign->modules_data as $key => $module) {
                    Logging::info('Module moduleId= ' . $module['moduleId']);
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {
                        foreach ($module['structure']['columns'] as $column_key => $column_value) {
                            if (isset($column_value['components'])) {
                                foreach ($column_value['components'] as $component_key => $component_value) {
                                    if (isset($component_value['plugins'])) {
                                        foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                            if ($plugin_name === 'paletteBackgroundColor') {
                                                Logging::info('compoenent id= ' . $component_value['id']);
                                                $modules_data[$key]['structure']['columns'][$column_key]['components'][$component_key]
                                                ['plugins']['paletteBackgroundColor']['name'] = 'palette-background-color';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                $campaign->modules_data = $modules_data;

                /*
                 * Test and compare modules_data before and after and then
                 * uncomment the following line to save the campaign.
                */
                $campaign->save();
            }
        });
    }
    protected function setModuleRenamePaletteBackgroundColor(){
        /*
        * get all the modules
        * check that it is a two_cta_buttons module
        * and edit in structure.columns.components.button.attribute.width
        */

        Module::withTrashed()->chunk(100, function ($modules) {
            Logging::info('-------------------------');
            Logging::info('STUDIO');
            Logging::info('-------------------------');
            // Make it faster by disabling query log.

            $modules = Module::all();

            foreach ($modules as $key => &$module) {
                $module_structure = $module->structure;

                Logging::info('Module id= ' . $module['moduleId']);
                if (isset($module_structure) && isset($module_structure['columns'])) {
                    foreach ($module_structure['columns'] as $column_key => $column_value) {
                        if (isset($column_value['components'])) {
                            foreach ($column_value['components'] as $component_key => $component_value) {
                                Logging::info($module['name']);
                                if (isset($component_value['plugins'])) {
                                    foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                        if ($plugin_name === 'paletteBackgroundColor') {
                                            Logging::info('compoenent id= ' . $component_value['id']);
                                            $module_structure['columns'][$column_key]['components'][$component_key]
                                            ['plugins']['paletteBackgroundColor']['name']  = 'palette-background-color';
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
