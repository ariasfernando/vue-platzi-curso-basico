<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Stensul\Models\Module;
use Stensul\Models\Campaign;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log as Logging;

class AddUniqueIdForComponents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::connection()->disableQueryLog();
        Module::withTrashed()->chunk(100, function ($modules) {
    
            foreach ($modules as $key => &$module) {
                $module_structure = $module->structure;

                if (isset($module_structure) && isset($module_structure['columns'])) {
                    foreach ($module_structure['columns'] as $column_key => $column_value) {
                        if (isset($column_value['components'])) {
                            foreach ($column_value['components'] as $component_key => $component_value) {
                                Logging::info('name=' . $module['name']);
                                if (!isset($component_value['id'])) {
                                    $module_structure['columns'][$column_key]['components'][$component_key]['id'] = (int)floor(100000 + (mt_rand() / mt_getrandmax() * 900000));
                                }
                            }
                        }
                    }
                }

                $module->structure = $module_structure;
                $module->save();
            }
        });
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
