<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;
use Stensul\Models\Module;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;


class UpdateCampaignModulesFieldText extends Migration
{
    /**
     * This is a sample migration to change module structure on existing campaigns.
     * Create the migration by running `php artisan make:migration migration_name`
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

                /*
                 * Change this:
                 *    structure
                 *        columns
                 *            components
                 *                text-component
                 *                    text
                 *
                 * To this:
                 *    structure
                 *        columns
                 *            components
                 *                text-component
                 *                    data
                 *                        text
                */
                $modules_data = $campaign->modules_data;
                foreach ($campaign->modules_data as $key => $module) {
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {
                        foreach ($module['structure']['columns'] as $column_key => $column_value) {
                            if (isset($column_value['components'])) {
                                foreach ($column_value['components'] as $component_key => $component_value) {

                                    if (isset($component_value['type']) && $component_value['type'] === 'text-element') {
                                        if (isset($component_value['text'])) {
                                            $modules_data[$key]['structure']['columns'][$column_key]
                                                ['components'][$component_key]['data']
                                                    ['text'] = $component_value['text'];
                                        }
                                    }

                                    unset($modules_data[$key]['structure']['columns'][$column_key]
                                        ['components'][$component_key]['text']);
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
