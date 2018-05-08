<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Library;
use Stensul\Models\Campaign;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Log as Logging;

class FillCampaignsLibraryName extends Migration
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
            Logging::info('Filling library_name attribute in campaigns for Library ' . $library->id . ' with name ' . $library->name);
            
            // We do not use directly the Campaign model class to avoid touching the update_at attribute
            $result = DB::table('campaigns')->where('library', new ObjectID($library->id))->update(['library_name' => $library->name]);

            Logging::info('Updated ' . $result . ' campaigns');
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
