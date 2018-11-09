<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;
use MongoDB\BSON\ObjectID;

class ModuleUsage extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('modules_usage')) {
            Schema::create('modules_usage');
            Schema::table('modules_usage', function ($table) {
                $table->index('campaign_id', 'modules_usage_campaign_id_index');
                $table->index('module_id', 'modules_usage_module_id_index');
                $table->unique(['campaign_id', 'module_id'], 'modules_usage-campaign_id-module_id-unique');
            });
        }

        \CampaignModel::withTrashed()->chunk(100, function ($campaigns) {
            foreach ($campaigns as $campaign) {
                Log::info(sprintf('Fetching campaign id: %s', $campaign->id));
                if (isset($campaign['modules_data'])) {
                    foreach ($campaign['modules_data'] as $module) {
                        try {
                            if (isset($module['_id'])) {
                                Log::info(sprintf('Module id: %s', $module['_id']));
                                \ModuleUsageModel::create([
                                    'campaign_id' => new ObjectId($campaign->id),
                                    'module_id' => new ObjectId($module['_id']),
                                ]);
                            }
                        } catch (\MongoDB\Driver\Exception\BulkWriteException $e) {
                            if ($e->getCode() === 11000) {
                                \Log::info(sprintf('Ignoring duplicate module id: %s', $module['_id']));
                            } else {
                                throw $e;
                            }
                        }
                    }
                }
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
        Schema::dropIfExists('modules_usage');
    }
}
