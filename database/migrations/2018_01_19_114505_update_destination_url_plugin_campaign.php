<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;
use Stensul\Models\Module;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;

class UpdateDestinationUrlPluginCampaign extends Migration
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

        /*
         * Iterate through all campaigns
         * Get a bunch of campaigns at a time to save roundtrip times to the server.
        */
        Campaign::withTrashed()->chunk(100, function ($campaigns) {

            foreach ($campaigns as $campaign) {
                Logging::info('Campaign ' . $campaign->id);

                $modules_data = $campaign->modules_data;
                foreach ($campaign->modules_data as $key => $module) {
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {
                        foreach ($module['structure']['columns'] as $column_key => $column_value) {
                            if (isset($column_value['components'])) {
                                foreach ($column_value['components'] as $component_key => $component_value) {
                                    if (isset($component_value['type']) && ($component_value['type'] === 'image-element' || $component_value['type'] === 'button-element')) {
                                        if (isset($component_value['plugins'])) {
                                            foreach ($component_value['plugins'] as $plugin_name => $plugin) {
                                                if ($plugin_name === 'destinationUrl') {

                                                    if (isset($plugin['config']['required'])) {
                                                        if (isset($plugin['config']['validations'])) {
                                                            $modules_data[$key]['structure']['columns'][$column_key]['components'][$component_key]
                                                                               ['plugins'][$plugin_name]['config']['validations']['required'] = $plugin['config']['required'];
                                                        } else {
                                                            $validations = [
                                                                'required' => false,
                                                                'url' => false
                                                            ];

                                                            $modules_data[$key]['structure']['columns'][$column_key]['components'][$component_key]
                                                                               ['plugins'][$plugin_name]['config']['validations'] = $validations;

                                                        }
                                                        unset($modules_data[$key]['structure']['columns'][$column_key]['components'][$component_key]
                                                                                 ['plugins'][$plugin_name]['config']['required']);
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

                $campaign->modules_data = $modules_data;

                /*
                 * Test and compare modules_data before and after and then
                 * uncomment the following line to save the campaign.
                */
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
        // Implement the code to reverse the migration here if needed.
    }
}
