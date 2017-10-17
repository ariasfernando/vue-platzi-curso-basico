<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class AdminPermissions extends Migration
{
    private $permissions = [
        ['name' => 'access_admin', 'description' => 'Allow user to access to Admin panel.'],
        ['name' => 'access_admin_libraries', 'description' => 'Allow user to access libraries.'],
        ['name' => 'access_admin_modules', 'description' => 'Allow user to access modules.'],
        ['name' => 'access_admin_permissions', 'description' => 'Allow user to access permissions.'],
        ['name' => 'access_admin_roles', 'description' => 'Allow user to access roles.'],
        ['name' => 'access_admin_users', 'description' => 'Allow user to access users.']
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach ($this->permissions as $permission) {
            Permission::create($permission);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $names_to_delete = array_map(function ($row) {
            return $row['name'];
        }, $this->permissions);
        Permission::whereIn('name', $names_to_delete)->delete();
    }
}
