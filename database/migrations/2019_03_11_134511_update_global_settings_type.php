<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Setting;

class UpdateGlobalSettingsType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Setting::where('properties.type', 'toogle')->update(['properties.type' => 'toggle']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Setting::where('properties.type', 'toggle')->update(['properties.type' => 'toogle']);
    }
}
