<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class AddLibrarySettingsPermissions extends Migration
{
    private $permissions = [
        ['name' => 'library-basic-settings', 'description' => 'Library Basic Settings'],
        ['name' => 'library-advance-settings', 'description' => 'Library Advance Settings'],
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

        //studio-master and studio-advanced
        $roles = \Stensul\Models\Role::where('name', 'like', 'studio-master')->orWhere('name', 'like', 'studio-advanced')->get();

        $newPermissions = array_map(function ($row) {
            return $row['name'];
        }, $this->permissions);

        foreach ($roles as $role) {
            $role->permissions = array_merge($role->permissions, $newPermissions);
            $role->save();
        }

        //studio-user
        $roles = \Stensul\Models\Role::where('name', 'like', 'studio-user')->get();

        $newPermissions = ['library-basic-settings'];

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

        $roles = \Stensul\Models\Role::whereIn('name', ['studio-master', 'studio-advanced', 'studio-user' ])->get();

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
