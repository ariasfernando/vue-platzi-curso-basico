<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('tags')) {
            Schema::create('tags');
            Campaign::withTrashed()->chunk(20, function ($campaigns) {
                foreach ($campaigns as $campaign) {
                    if (empty($campaign->tags)) {
                        $campaign->tags = [];
                        $campaign->timestamps = false;
                        $campaign->save();
                    }
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('tags');
    }
}
