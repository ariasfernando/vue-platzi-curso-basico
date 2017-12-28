<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class AssignPermissions extends Migration
{
    /**
     * Assign all permissions to admin role.
     *
     * @return void
     */
    public function up()
    {
        $role = Role::where('name', '=', 'admin')->first();
        if ($role) {
            $permissions = Permission::all();
            $role_perms = [];
            foreach ($permissions as $permission) {
                $role_perms[] = $permission->name;
            }
            $role->permissions = $role_perms;
            $role->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $role = Role::where('name', '=', 'admin')->first();
        if ($role) {
            $role->permissions = [];
            $role->save();
        }
    }
}
