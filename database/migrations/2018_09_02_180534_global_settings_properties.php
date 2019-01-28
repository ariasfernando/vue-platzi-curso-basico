<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Setting;


class GlobalSettingsProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $settings = Setting::all();

        foreach ($settings as $setting) {
            if (!isset($setting->properties)) {
                if (is_array($setting->value)) {
                    $properties = ["type" => "textarea"];
                } else {
                    $properties = ["type" => "toogle"];
                }
                $setting->properties = $properties;
                $setting->save();
            }
        }
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
