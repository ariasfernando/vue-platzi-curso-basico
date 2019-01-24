<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;
use Stensul\Models\Library;
use Stensul\Models\Campaign;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;

class editValidationPlugins extends Migration
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

        $this->editPluginsToCampaigns();
        $this->setPluginsColumnsToModule();

    }
    protected function editPluginsToCampaigns(){
        /*
        * get all the campaigns
        * for each campaign, get all modules
        * for each module, check that it is a two_cta_buttons module
        * and edit in structure.columns.components.button.attribute.width
        */

        Campaign::withTrashed()->chunk(100, function ($campaigns) {
            Logging::info('-------------------------');
            Logging::info('CAMPAIGNS');
            Logging::info('-------------------------');
            foreach ($campaigns as $campaign) {

                $modules_data = $campaign["modules_data"];
                foreach ($modules_data as $key => $module) {
                    if (isset($module["key"])) {
                        if (isset($modules_data[$key]["structure"]['columns'])) {
                            foreach ($modules_data[$key]["structure"]['columns'] as $column_key => $column) {
                                if (isset($column['components'])) {
                                    foreach ($column['components'] as $component_key => $component) {
                                        if (isset($component['plugins'])) {
                                            if (isset($component['plugins']['styleImageEditor'])) {
                                                Logging::info('----');
                                                Logging::info('It will edit in campaigns -> module key = ' . $module["key"] . 'plugin = styleImageEditor add = runBackground => true');
                                                $modules_data[$key]["structure"]['columns'][$column_key]['components'][$component_key]['plugins']['styleImageEditor']['runBackground'] = true;
                                            }
                                            if (isset($component['plugins']['destinationUrl'])) {
                                                Logging::info('----');
                                                Logging::info('It will edit in campaigns -> module key = ' . $module["key"] . 'plugin = destinationUrl add = runBackground => true');
                                                $modules_data[$key]["structure"]['columns'][$column_key]['components'][$component_key]['plugins']['destinationUrl']['runBackground'] = true;
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
                $campaign->timestamps = false;
                $campaign->save();
            }
        });
    }
    protected function setPluginsColumnsToModule(){
        /*
        * get all the modules
        * check that it is a two_cta_buttons module
        * and edit in structure.columns.components.button.attribute.width
        */

        Module::withTrashed()->chunk(100, function ($modules) {
            Logging::info('-------------------------');
            Logging::info('STUDIO');
            Logging::info('-------------------------');

            foreach ($modules as $module) {

                $module_structure = $module["structure"];
                Logging::info('----');
                Logging::info('It will edit in studio -> module key = ' . $module["key"]);
                if (isset($module_structure['columns'])) {
                    foreach ($module_structure['columns'] as $column_key => $column) {
                        if (isset($column['components'])) {
                            foreach ($column['components'] as $component_key => $component) {
                                if (isset($component['plugins'])) {
                                    if (isset($component['plugins']['styleImageEditor'])) {
                                        Logging::info('----');
                                        Logging::info('It will edit in studio -> module key = ' . $module["key"] . 'plugin = styleImageEditor add = runBackground => true');
                                        $module_structure['columns'][$column_key]['components'][$component_key]['plugins']['styleImageEditor']['runBackground'] = true;
                                    }
                                    if (isset($component['plugins']['destinationUrl'])) {
                                        Logging::info('----');
                                        Logging::info('It will edit in studio -> module key = ' . $module["key"] . 'plugin = destinationUrl add = runBackground => true');
                                        $module_structure['columns'][$column_key]['components'][$component_key]['plugins']['destinationUrl']['runBackground'] = true;
                                    }
                                }
                            }
                        }
                    }
                }

                $module->structure = $module_structure;
                /*
                * Test and compare modules_data before and after and then
                * uncomment the following line to save the module.
                */
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
