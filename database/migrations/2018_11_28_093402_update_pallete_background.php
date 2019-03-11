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

        Logging::info('-------------------------');
        Logging::info('CAMPAIGNS');
        Logging::info('-------------------------');

        Campaign::withTrashed()->chunk(20, function ($campaigns) {

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
                                            if ($plugin_name === 'paletteBackgroundColor') {
                                                Logging::info('component id= ' . $component_value['id']);
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
                $campaign->timestamps = false;
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

        Logging::info('-------------------------');
        Logging::info('STUDIO');
        Logging::info('-------------------------');

        Module::withTrashed()->chunk(20, function ($modules) {

            foreach ($modules as $key => &$module) {
                $module_structure = $module->structure;

                Logging::info('Module id= ' . $module['name']);
                if (isset($module_structure) && isset($module_structure['columns'])) {
                    foreach ($module_structure['columns'] as $column_key => $column_value) {
                        if (isset($column_value['components'])) {
                            foreach ($column_value['components'] as $component_key => $component_value) {
                                Logging::info($module['name']);
                                if (isset($component_value['plugins'])) {
                                    foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                        if ($plugin_name === 'paletteBackgroundColor') {
                                            Logging::info('component id= ' . $component_value['id']);
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
                $module->timestamps = false;
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
