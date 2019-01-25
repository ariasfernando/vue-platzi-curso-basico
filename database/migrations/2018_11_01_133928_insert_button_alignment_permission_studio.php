<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class InsertButtonAlignmentPermissionStudio extends Migration
{

    private $permissions = [
        ['name' => 'std-button-element-plugin-alignment', 'description' => '']
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

        $roles = \Stensul\Models\Role::where('name', 'like', 'studio-%')->get();

        $newPermissions = array_map(function ($row) {
            return $row['name'];
        }, $this->permissions);

        foreach ($roles as $role) {
            $role->permissions = array_merge($role->permissions, $newPermissions);
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
        $names_to_delete = array_map(function ($row) {
            return $row['name'];
        }, $this->permissions);
        Permission::whereIn('name', $names_to_delete)->delete();

        $roles = \Stensul\Models\Role::where('name', 'like', 'studio-%')->get();

        foreach ($roles as $role) {
            $rolePermissions = $role->permissions;
            foreach ($this->permissions as $permission){
                $this->searchAndUnset($rolePermissions, $permission['name']);
            }
            $role->permissions = $rolePermissions;
            $role->save();
        }
    }

    private function searchAndUnset(&$arr, $perm)
    {
        if (($key = array_search($perm, $arr)) !== false) {
            unset($arr[$key]);
        }
    }

}
