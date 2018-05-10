<?php

use Stensul\Models\Library;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Stensul\Providers\ModuleServiceProvider;
use Illuminate\Database\Migrations\Migration;

class UpdateLibrariesMenu extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Make it faster by disabling query log.
        DB::connection()->disableQueryLog();
        
        $modules = ModuleServiceProvider::getModuleList();

        $libraries = Library::all();
        if (count($libraries)) {
            foreach ($libraries as $library) {
                $modules_menu = [];
                foreach ($library->modules as $key => $mod) {
                    if (is_array($mod)) {
                        $modules_sub_menu = [];
                        foreach ($mod as $sub_mod) {
                            $modules_sub_menu[] = [
                                                    'name' => isset($modules[$sub_mod]) && isset($modules[$sub_mod]->name) ? $modules[$sub_mod]->name : $sub_mod,
                                                    'moduleId'  => $sub_mod,
                                                    'type' => 'item'
                                                    ];
                        }
                        $modules_menu[] = [
                                            'name'     => $key,
                                            'type'     => 'sub-menu',
                                            'modules'  => $modules_sub_menu
                                            ];
                    } else {
                        $modules_menu[] = [
                                            'name' => isset($modules[$mod]) && isset($modules[$mod]->name) ? $modules[$mod]->name : $mod,
                                            'moduleId'  => $mod,
                                            'type' => 'item'
                                            ];
                    }
                    
                }
                $library->modules = $modules_menu;
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
