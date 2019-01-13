<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;

class AddArchiveCampaign extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::connection()->disableQueryLog();

        Campaign::withTrashed()->chunk(100, function ($campaigns) {
            foreach ($campaigns as $campaign) {
                $campaign->archive = false;
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
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('archive');
        });
    }
}
