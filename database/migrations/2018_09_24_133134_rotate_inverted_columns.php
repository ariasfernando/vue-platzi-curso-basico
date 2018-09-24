<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;
use Stensul\Models\Library;
use Stensul\Models\Campaign;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;


class RotateInvertedColumns extends Migration
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
        
        $this->editWidthColumnsToCampaigns();
        $this->setWidthColumnsToModule();

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::connection()->disableQueryLog();
        //
    }


    protected function needEdit($module_structure){
        return isset($module_structure['columnsStacking']) && $module_structure['columnsStacking'] === 'invertedStacking' && count($module_structure['columns']) == 2;
    }
    protected function editWidthColumnsToCampaigns(){
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
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {
                        if ($this->needEdit($module["structure"])) {
                            Logging::info('----');
                            Logging::info('It will rotate columns in campaigns -> module key = ' . $module["key"]);
                            $column_1 = $module['structure']['columns'][0];
                            $column_0 = $module['structure']['columns'][1];
                            $modules_data[$key]['structure']['columns'][1] = $column_1;
                            $modules_data[$key]['structure']['columns'][0] = $column_0;
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
    protected function setWidthColumnsToModule(){
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
                if ($this->needEdit($module_structure)) {
                    Logging::info('----');
                    Logging::info('It will rotate columns in studio -> module key = ' . $module["key"]);
                    $column_1 = $module_structure['columns'][0];
                    $column_0 = $module_structure['columns'][1];
                    $module_structure['columns'][1] = $column_1;
                    $module_structure['columns'][0] = $column_0;
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
}
