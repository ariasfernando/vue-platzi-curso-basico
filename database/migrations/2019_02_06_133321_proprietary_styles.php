<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Library;

class ProprietaryStyles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach (Library::all() as $key => $library) {
            $config = $library->config;
            if ($config['propietaryCss'] !== '' && strpos($config['propietaryCss'], '<style>') === false) {
                $config['propietaryCss'] = "<style>\n{$config['propietaryCss']}\n</style>";
                $library->config = $config;
                $library->save();
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
