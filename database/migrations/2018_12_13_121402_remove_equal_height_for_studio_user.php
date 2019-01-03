<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class RemoveEqualHeightForStudioUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // USER
        // remove std-plugin-module-equal-height-for-column
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $this->searchAndUnset($rolePermissions, 'std-plugin-module-equal-height-for-column');
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
        // USER
        // add std-plugin-module-equal-height-for-column
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'std-plugin-module-equal-height-for-column';
        $role->permissions = $rolePermissions;
        $role->save();
    }

    private function searchAndUnset(&$arr, $perm)
    {
        if (($key = array_search($perm, $arr)) !== false) {
            unset($arr[$key]);
        }
    }

}
