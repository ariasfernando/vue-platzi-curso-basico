<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class UpdatePermissionsRoleAssignmentStudioPalleteBackground extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         // ADMIN
         // add std-text-element-plugin-palette-background-color 
         $role = Role::where('name', 'studio-master')->firstOrFail();
         $rolePermissions = $role->permissions;
         $rolePermissions[] = 'std-text-element-plugin-palette-background-color';
         $rolePermissions[] = 'std-image-element-plugin-palette-background-color';
         $rolePermissions[] = 'std-divider-element-plugin-palette-background-color';
         $rolePermissions[] = 'std-button-element-plugin-palette-background-color';
         $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-pallete-background-color');
         $this->searchAndUnset($rolePermissions, 'std-image-element-plugin-pallete-background-color');
         $this->searchAndUnset($rolePermissions, 'std-divider-element-plugin-pallete-background-color');
         $this->searchAndUnset($rolePermissions, 'std-button-element-plugin-pallete-background-color');
         $role->permissions = $rolePermissions;
         $role->save();
         
         // ADVANCED
         // add std-text-element-plugin-palette-background-color 
         $role = Role::where('name', 'studio-advanced')->firstOrFail();
         $rolePermissions = $role->permissions;
         $rolePermissions[] = 'std-text-element-plugin-palette-background-color';
         $rolePermissions[] = 'std-image-element-plugin-palette-background-color';
         $rolePermissions[] = 'std-divider-element-plugin-palette-background-color';
         $rolePermissions[] = 'std-button-element-plugin-palette-background-color';
         $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-pallete-background-color');
         $this->searchAndUnset($rolePermissions, 'std-image-element-plugin-pallete-background-color');
         $this->searchAndUnset($rolePermissions, 'std-divider-element-plugin-pallete-background-color');
         $this->searchAndUnset($rolePermissions, 'std-button-element-plugin-pallete-background-color');
         $role->permissions = $rolePermissions;
         $role->save();

        // USER
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'std-text-element-plugin-palette-background-color';
        $rolePermissions[] = 'std-image-element-plugin-palette-background-color';
        $rolePermissions[] = 'std-divider-element-plugin-palette-background-color';
        $rolePermissions[] = 'std-button-element-plugin-palette-background-color';
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-pallete-background-color');
        $this->searchAndUnset($rolePermissions, 'std-image-element-plugin-pallete-background-color');
        $this->searchAndUnset($rolePermissions, 'std-divider-element-plugin-pallete-background-color');
        $this->searchAndUnset($rolePermissions, 'std-button-element-plugin-pallete-background-color');
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
        // remove std-divider-element-plugin-palette-background-color
        $role = Role::where('name', 'studio-master')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'std-text-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-image-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-divider-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-button-element-plugin-pallete-background-color';
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-image-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-divider-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-button-element-plugin-palette-background-color');
        $role->permissions = $rolePermissions;
        $role->save();

        // ADVANCED
        // remove std-divider-element-plugin-palette-background-color
        $role = Role::where('name', 'studio-advanced')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'std-text-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-image-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-divider-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-button-element-plugin-pallete-background-color';
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-image-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-divider-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-button-element-plugin-palette-background-color');
        $role->permissions = $rolePermissions;
        $role->save();

        // USER
        // add std-divider-element-plugin-palette-background-color
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'std-text-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-image-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-divider-element-plugin-pallete-background-color';
        $rolePermissions[] = 'std-button-element-plugin-pallete-background-color';
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-image-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-divider-element-plugin-palette-background-color');
        $this->searchAndUnset($rolePermissions, 'std-button-element-plugin-palette-background-color');
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
