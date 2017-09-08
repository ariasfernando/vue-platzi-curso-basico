<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Setting;


class AddPreheaderConfig extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Setting::create([
            'name' => 'Enable Preheader',
            'key' => 'enable_preheader',
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
        if ($setting = Setting::where('key', '=', 'enable_preheader')->first()) {
            $setting->delete();
        }
    }
}
