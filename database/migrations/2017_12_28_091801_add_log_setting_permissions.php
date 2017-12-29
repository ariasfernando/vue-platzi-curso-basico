<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class AddLogSettingPermissions extends Migration
{
    /**
     * Adds access_admin_logs and access_admin_settings
     * and assign the to the admin role.
     *
     * @return void
     */
    public function up()
    {
        Permission::create([
            'name' => 'access_admin_logs',
            'description' => 'Allows users to access logs.'
        ]);

        Permission::create([
            'name' => 'access_admin_settings',
            'description' => 'Allows users to access admin settings.'
        ]);

        $role = Role::where('name', '=', 'admin')->first();
        if ($role) {
            $role_perms = $role->permissions;
            $role_perms[] = 'access_admin_logs';
            $role_perms[] = 'access_admin_settings';
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
        Permission::where('name', 'access_admin_logs')->delete();
        Permission::where('name', 'access_admin_settings')->delete();
        $role = Role::where('name', '=', 'admin')->first();

        if ($role) {
            $role_perms = [];
            foreach ($role->permissions as $permission) {
                if (!in_array($permission, ['access_admin_logs', 'access_admin_settings'])) {
                    $role_perms[] = $permission;
                }
            }
            $role->permissions = $role_perms;
            $role->save();
        }
    }
}
