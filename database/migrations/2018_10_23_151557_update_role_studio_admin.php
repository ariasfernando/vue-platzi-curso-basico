<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class UpdateRoleStudioAdmin extends Migration
{
   
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
   {
        $role = Role::where('name', 'studio-admin')->firstOrFail();
        $role->name = 'studio-master';
        $role->save();
   }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $role = Role::where('name', 'studio-master')->firstOrFail();
        $role->name = 'studio-admin';
        $role->save();
    }

}
