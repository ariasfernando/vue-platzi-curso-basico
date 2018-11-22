<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class UpdatePermissionsStudioLinesLimit extends Migration
{

    private $permissions = [
        ['name' => 'tiny-plugin-lines_limit_advanced', 'description' => ''],
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
        // ADVANCED
        // add tiny-plugin-lines_limit_advanced
        $role = Role::where('name', 'studio-advanced')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'tiny-plugin-lines_limit_advanced';
        // remove tiny-plugin-lines_limit
        $this->searchAndUnset($rolePermissions, 'tiny-plugin-lines_limit');
        $role->permissions = $rolePermissions;
        $role->save();

        // MASTER
        // add tiny-plugin-lines_limit_advanced
        $role = Role::where('name', 'studio-master')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'tiny-plugin-lines_limit_advanced';
        // remove tiny-plugin-lines_limit
        $this->searchAndUnset($rolePermissions, 'tiny-plugin-lines_limit');
        $role->permissions = $rolePermissions;
        $role->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // ADVANCED
        $role = Role::where('name', 'studio-advanced')->firstOrFail();
        $rolePermissions = $role->permissions;
        // remove tiny-plugin-lines_limit_advanced
        $this->searchAndUnset($rolePermissions, 'tiny-plugin-lines_limit_advanced');
        // add tiny-plugin-lines_limit
        $rolePermissions[] = 'tiny-plugin-lines_limit';
        $role->permissions = $rolePermissions;
        $role->save();

        // MASTER
        $role = Role::where('name', 'studio-master')->firstOrFail();
        $rolePermissions = $role->permissions;
        // remove tiny-plugin-lines_limit_advanced
        $this->searchAndUnset($rolePermissions, 'tiny-plugin-lines_limit_advanced');
        // add tiny-plugin-lines_limit
        $rolePermissions[] = 'tiny-plugin-lines_limit';
        $role->permissions = $rolePermissions;
        $role->save();

        $names_to_delete = array_map(function ($row) {
            return $row['name'];
        }, $this->permissions);
        Permission::whereIn('name', $names_to_delete)->delete();
    }

    private function searchAndUnset(&$arr, $perm)
    {
        if (($key = array_search($perm, $arr)) !== false) {
            unset($arr[$key]);
        }
    }
}
