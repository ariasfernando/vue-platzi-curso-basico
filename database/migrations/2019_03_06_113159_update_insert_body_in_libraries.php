<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Library;

class UpdateInsertBodyInLibraries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $libraries = Library::withTrashed()->get();
        foreach ($libraries as $library) {
            $config = $library->config;
            if (!isset($config['insertBody'])) {
                $config['insertBody'] = true;
                $library->config = $config;
            }
            if (isset($library->insertBody)) {
                $library->unset('insertBody');
            }
            $library->timestamps = false;
            $library->save();
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
