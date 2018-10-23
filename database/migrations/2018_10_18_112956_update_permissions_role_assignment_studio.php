<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class UpdatePermissionsRoleAssignmentStudio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         // ADMIN
         // add std-divider-element_style_inner-bgcolor_advanced 
         // and remove std-divider-element_style_inner-bgcolor
         $role = Role::where('name', 'studio-admin')->firstOrFail();
         $rolePermissions = $role->permissions;
         $this->searchAndUnset($rolePermissions, 'std-divider-element_style_inner-bgcolor');
         $rolePermissions[] = 'std-divider-element_style_inner-bgcolor_advanced';
         $role->permissions = $rolePermissions;
         $role->save();
         
         // ADVANCED
         // add std-divider-element_style_inner-bgcolor_advanced 
         // and remove std-divider-element_style_inner-bgcolor
         $role = Role::where('name', 'studio-advanced')->firstOrFail();
         $rolePermissions = $role->permissions;
         $this->searchAndUnset($rolePermissions, 'std-divider-element_style_inner-bgcolor');
         $rolePermissions[] = 'std-divider-element_style_inner-bgcolor_advanced';
         $role->permissions = $rolePermissions;
         $role->save();

        // USER
        // remove std-divider-element_style_bgcolor from studio-user
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $this->searchAndUnset($rolePermissions, 'std-divider-element_style_bgcolor');
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
        // ADMIN
        // remove std-divider-element_style_inner-bgcolor_advanced 
        // and add std-divider-element_style_inner-bgcolor
        $role = Role::where('name', 'studio-admin')->firstOrFail();
        $rolePermissions = $role->permissions;
        $this->searchAndUnset($rolePermissions, 'std-divider-element_style_inner-bgcolor_advanced');
        $rolePermissions[] = 'std-divider-element_style_inner-bgcolor';
        $role->permissions = $rolePermissions;
        $role->save();

        // ADVANCED
        // remove std-divider-element_style_inner-bgcolor_advanced 
        // and add std-divider-element_style_inner-bgcolor
        $role = Role::where('name', 'studio-advanced')->firstOrFail();
        $rolePermissions = $role->permissions;
        $this->searchAndUnset($rolePermissions, 'std-divider-element_style_inner-bgcolor_advanced');
        $rolePermissions[] = 'std-divider-element_style_inner-bgcolor';
        $role->permissions = $rolePermissions;
        $role->save();

        // USER
        // add std-divider-element_style_bgcolor from studio-user
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'std-divider-element_style_bgcolor';
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
