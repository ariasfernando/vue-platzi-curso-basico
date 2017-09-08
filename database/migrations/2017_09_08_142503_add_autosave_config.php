<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Setting;

class AddAutosaveConfig extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Setting::create([
            'name' => 'Enable Auto Save',
            'key' => 'auto_save',
            'value' => '1'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if ($setting = Setting::where('key', '=', 'auto_save')->first()) {
            $setting->delete();
        }
    }
}
