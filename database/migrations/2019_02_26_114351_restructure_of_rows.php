<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Stensul\Models\Module;
use Stensul\Models\Campaign;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log as Logging;

class RestructureOfRows extends Migration
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
        $this->setNewEstructureOfRowsInStudio();
        $this->setNewEstructureOfRowsInCampaign();
    }

    protected function setNewEstructureOfRowsInStudio() {
        Module::withTrashed()->chunk(20, function ($modules) {
            Logging::info('-------------------------');
            Logging::info('Studio modules');
            Logging::info('-------------------------');
            foreach ($modules as $key => &$module) {
                $module_structure = $module->structure;
                $module_plugins = $module->plugins;

                if (isset($module_structure) && isset($module_structure['columns'])) {

                    Logging::info('--------------');
                    Logging::info('set module name : '.$module['name']);
                    Logging::info('Start set rows columns >>>>');
                    $module_structure['rows'] = [];
                    $module_structure['rows'][0] = [];
                    $module_structure['rows'][0]['id'] = 123456;
                    $module_structure['rows'][0]['type'] = 'row-element';
                    $module_structure['rows'][0]['columnsStacking'] = $module_structure['columnsStacking'] ?? 'normal';
                    $module_structure['rows'][0]['columns'] = $module_structure['columns'];
                    unset($module_structure['columns']);
                    unset($module_structure['columnsStacking']);
                    Logging::info('End <<<<');

                    Logging::info('Start set plugins rows >>>>');
                    $module_structure['rows'][0]['plugins'] = [];
                    if (isset($module_plugins['moduleEqualHeightForColumn'])) {
                        $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn'] = $module_plugins['moduleEqualHeightForColumn'];
                        $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn']['name'] = 'row-equal-height-for-column';
                        $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn']['target']= [];
                        $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn']['target'][0]= 'row';
                        unset($module_plugins['moduleEqualHeightForColumn']);
                    }
                    Logging::info('End <<<<');

                    Logging::info('Start set container rows >>>>');
                    $module_structure['rows'][0]['container'] = [];
                    $module_structure['rows'][0]['container']['style'] = [];
                    $module_structure['rows'][0]['container']['attribute'] = [];
                    $module_structure['rows'][0]['container']['styleOption'] = [];
                    unset($module_plugins['moduleEqualHeightForColumn']);
                    Logging::info('End <<<<');
                }
                $module->structure = $module_structure;
                $module->plugins = $module_plugins;
                $module->timestamps = false;
                $module->save();
            }
        });
    }
    protected function setNewEstructureOfRowsInCampaign() {
        Campaign::withTrashed()->chunk(30, function ($campaigns) {
            Logging::info('-------------------------');
            Logging::info('Campaigns modules');
            Logging::info('-------------------------');
            foreach ($campaigns as $campaign) {
                Logging::info('Campaign id= ' . $campaign->id);

                $modules_data = $campaign->modules_data;
                foreach ($campaign->modules_data as $key => $module) {
                    Logging::info('Module moduleId= ' . $module['name']);
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {

                        $module_structure = $module['structure'];
                        $module_plugins = $module['plugins'];

                        if (isset($module_structure) && isset($module_structure['columns'])) {

                            Logging::info('--------------');
                            Logging::info($module['name']);
                            Logging::info('Start set rows columns >>>>');
                            $module_structure['rows'] = [];
                            $module_structure['rows'][0] = [];
                            $module_structure['rows'][0]['id'] = 123456;
                            $module_structure['rows'][0]['type'] = 'row-element';
                            $module_structure['rows'][0]['columnsStacking'] = $module_structure['columnsStacking'] ?? 'normal';
                            $module_structure['rows'][0]['columns'] = $module_structure['columns'];
                            unset($module_structure['columns']);
                            unset($module_structure['columnsStacking']);
                            Logging::info('End <<<<');

                            Logging::info('Start set plugins rows >>>>');
                            $module_structure['rows'][0]['plugins'] = [];
                            if (isset($module_plugins['moduleEqualHeightForColumn'])) {
                                $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn'] = $module_plugins['moduleEqualHeightForColumn'];
                                $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn']['name'] = 'row-equal-height-for-column';
                                $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn']['target']= [];
                                $module_structure['rows'][0]['plugins']['rowEqualHeightForColumn']['target'][0]= 'row';
                                unset($module_plugins['moduleEqualHeightForColumn']);
                            }
                            Logging::info('End <<<<');

                            Logging::info('Start set container rows >>>>');
                            $module_structure['rows'][0]['container'] = [];
                            $module_structure['rows'][0]['container']['style'] = [];
                            $module_structure['rows'][0]['container']['attribute'] = [];
                            $module_structure['rows'][0]['container']['attribute']['width'] = '100%';
                            $module_structure['rows'][0]['container']['styleOption'] = [];
                            Logging::info('End <<<<');
                            Logging::info('--------------');
                        }
                        $modules_data[$key]['structure'] = $module_structure;
                        $modules_data[$key]['plugins']  = $module_plugins;
                    }
                }
                $campaign->modules_data = $modules_data;
                $campaign->timestamps = false;
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
