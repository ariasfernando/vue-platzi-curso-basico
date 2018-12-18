<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Library;

class AddInsertBodyToLibraries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $libraries = Library::all();
        foreach ($libraries as $library) {
            if ($library->insertBody == undefined) {
                $library->insertBody = true;
                $library->timestamps = false;
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
