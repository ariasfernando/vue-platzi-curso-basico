<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Setting;


class AddCustomFontsSetting extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $custom_fonts_setting = [
            'name' => 'Custom Fonts',
            'key' => 'custom_fonts',
            'value' => [],
            'properties' => [
                "type" => 'fonts'
            ]
        ];
        Setting::create($custom_fonts_setting);
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
}
