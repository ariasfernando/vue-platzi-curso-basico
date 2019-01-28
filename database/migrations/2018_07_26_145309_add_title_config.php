<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Setting;

class AddTitleConfig extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Setting::create([
            'name' => 'Enable Email Title',
            'key' => 'enable_title',
            'value' => '0'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if ($setting = Setting::where('key', '=', 'enable_title')->first()) {
            $setting->delete();
        }
    }
}
