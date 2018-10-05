<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;
use Stensul\Models\Library;
use Stensul\Models\Campaign;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;

class EditColumnsWidth extends Migration
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
    }
    
    protected function editColumn($column, $column_key){
        if (isset($column['container']) &&
            (
                isset($column['container']['style']['paddingRight']) && intval($column['container']['style']['paddingRight']) ||
                isset($column['container']['style']['paddingLeft']) && intval($column['container']['style']['paddingLeft'])
            ) &&
            substr($column['container']['attribute']['width'], -1) !== '%') {
            $width = $column['container']['attribute']['width'];
            $paddingRight = $column['container']['style']['paddingRight'] ?? 0;
            $paddingLeft = $column['container']['style']['paddingLeft'] ?? 0;
            $width = intval($width);
            $paddingRight = intval($paddingRight);
            $paddingLeft = intval($paddingLeft);
            $newWidth = $width + $paddingRight + $paddingLeft;
            $column['container']['attribute']['width'] = $newWidth;
            Logging::info('To column '.$column_key.' changed from '.$width.' width to '.$newWidth.' the paddingLeft is '. $paddingLeft .' the paddingRight is ' .$paddingRight);
            return $column;
        }
        Logging::info('To column '.$column_key.' it is not necessary change nothing');
        return $column;
    }

    protected function needEdit($module_structure){
        return isset($module_structure['columnsStacking']) && $module_structure['columnsStacking'] === 'normal' && count($module_structure['columns']) > 1;
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
                            Logging::info('It will edit in campaigns -> module key = ' . $module["key"]);
                            foreach ($module['structure']['columns'] as $column_key => $column) {
                                $column = $this->editColumn($column, $column_key);
                                $modules_data[$key]['structure']['columns'][$column_key] = $column;
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
                    Logging::info('It will edit in studio -> module key = ' . $module["key"]);
                    $module_structure = $module["structure"];
                    foreach ($module_structure['columns'] as $column_key => $column) {
                        $column = $this->editColumn($column, $column_key);
                        $module_structure['columns'][$column_key] = $column;
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
}