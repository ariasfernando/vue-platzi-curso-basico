<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;
use Stensul\Models\Module;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;

class UpdateStudioImagesPath extends Migration
{
    /**
     * This migration will change images path from 'customer/modules' to 'customer/modules/studio'
     * for images used in studio. We need to update this in modules and campaigns.
     *
     * @return void
     */
    public function up()
    {
        // Make it faster by disabling query log.
        DB::connection()->disableQueryLog();

        $this->updateImagesPathInCampaigns();
        $this->updateImagesPathInModules();
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

    protected function updateImagesPathInCampaigns()
    {
        /*
         * Iterate through all campaigns
         * Get a bunch of campaigns at a time to save roundtrip times to the server.
        */
        Campaign::withTrashed()->chunk(100, function ($campaigns) {

            foreach ($campaigns as $campaign) {
                Logging::info('Campaign ' . $campaign->id);

                $modules_data = $campaign->modules_data;
                foreach ($campaign->modules_data as $module_key => $module) {
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {
                        foreach ($module['structure']['columns'] as $column_key => $column_value) {
                            if (isset($column_value['components'])) {
                                foreach ($column_value['components'] as $component_key => $component_value) {
                                    if (isset($component_value['type'])) {
                                        switch ($component_value['type']) {
                                            case 'button-element':
                                                if (isset($component_value['buttonCaret']) && isset($component_value['buttonCaret']['attribute'])) {
                                                    if (isset($component_value['buttonCaret']['attribute']['url'])) {
                                                        if (strpos($component_value['buttonCaret']['attribute']['url'], 'customer/modules/') !== false) {
                                                            $new_value = str_replace('customer/modules/', 'customer/modules/studio/', $component_value['buttonCaret']['attribute']['url']);
                                                            $modules_data[$module_key]['structure']['columns'][$column_key]['components'][$component_key]['buttonCaret']['attribute']['url'] = $new_value;
                                                        }
                                                    }
                                                }
                                                break;
                                            case 'image-element':
                                                if (isset($component_value['attribute']) && $component_value['attribute']['placeholder']) {
                                                    if (strpos($component_value['attribute']['placeholder'], 'customer/modules/') !== false) {
                                                        $new_value = str_replace('customer/modules/', 'customer/modules/studio/', $component_value['attribute']['placeholder']);
                                                        $modules_data[$module_key]['structure']['columns'][$column_key]['components'][$component_key]['attribute']['placeholder'] = $new_value;
                                                    }
                                                }
                                                break;
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

    protected function updateImagesPathInModules()
    {
        /*
         * Iterate through all modules
         * Get a bunch of modules at a time to save roundtrip times to the server.
        */
        Module::withTrashed()->chunk(100, function ($modules) {

            foreach ($modules as $module) {

                Logging::info('Module ' . $module->id);

                $module_structure = $module->structure;
                if (isset($module_structure['columns'])) {
                    foreach ($module_structure['columns'] as $column_key => $column) {
                        if (isset($column['components'])) {
                            foreach ($column['components'] as $component_key => $component_value) {
                                if (isset($component_value['type'])) {
                                    switch ($component_value['type']) {
                                        case 'button-element':
                                            if (isset($component_value['buttonCaret']) && isset($component_value['buttonCaret']['attribute'])) {
                                                if (isset($component_value['buttonCaret']['attribute']['url'])) {
                                                    if (strpos($component_value['buttonCaret']['attribute']['url'], 'customer/modules/') !== false) {
                                                        $new_value = str_replace('customer/modules/', 'customer/modules/studio/', $component_value['buttonCaret']['attribute']['url']);
                                                        $module_structure['columns'][$column_key]['components'][$component_key]['buttonCaret']['attribute']['url'] = $new_value;
                                                    }
                                                }
                                            }
                                            break;
                                        case 'image-element':
                                            if (isset($component_value['attribute']) && $component_value['attribute']['placeholder']) {
                                                if (strpos($component_value['attribute']['placeholder'], 'customer/modules/') !== false) {
                                                    $new_value = str_replace('customer/modules/', 'customer/modules/studio/', $component_value['attribute']['placeholder']);
                                                    $module_structure['columns'][$column_key]['components'][$component_key]['attribute']['placeholder'] = $new_value;
                                                }
                                            }
                                            break;
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
}
