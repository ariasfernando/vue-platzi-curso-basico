<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class UpdateRolesStudioAcl extends Migration
{

    private $newRolePermissions = array(
        'std-image-element_editor_text_visible',
        'std-image-element_editor_text_default',
        'std-image-element_editor_text_description',
        'std-image-element_editor_text_top',
        'std-image-element_editor_text_left',
        'std-image-element_editor_overlay_visible',
        'std-image-element_editor_overlay_default',
        'std-image-element_editor_overlay_gallery',
        'std-image-element_editor_overlay_change',
        'std-image-element_editor_overlay_width',
        'std-image-element_editor_overlay_height',
        'std-image-element_editor_overlay_resizable',
        'std-image-element_editor_overlay_absolute',
        'std-image-element_editor_overlay_top',
        'std-image-element_editor_overlay_left',
        'std-image-element_editor_overlay_relative',
        'std-image-element_editor_overlay_fixed',
        'std-image-element_editor_overlay_follow',
        'std-image-element_editor_overlay_description',
        'std-image-element_editor_shapemask_visible',
        'std-image-element_editor_transparencycolor',
        'std-image-element_editor_transparency',
        'std-image-element_editor_shapemask_square',
        'std-image-element_editor_shapemask_circle'
    );
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
   {
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $role->permissions = array_merge($rolePermissions, $this->newRolePermissions);
        $role->save();

        $role = Role::where('name', 'studio-advanced')->firstOrFail();
        $rolePermissions = $role->permissions;
        $role->permissions = array_merge($rolePermissions, $this->newRolePermissions);
        $role->save();

        $role = Role::where('name', 'studio-admin')->firstOrFail();
        $rolePermissions = $role->permissions;
        $role->permissions = array_merge($rolePermissions, $this->newRolePermissions);
        $role->save();
   }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        foreach($this->newRolePermissions as $permission){
            $this->searchAndUnset($rolePermissions, $permission);
        }
        $role->permissions = $rolePermissions;
        $role->save();

        $role = Role::where('name', 'studio-advanced')->firstOrFail();
        $rolePermissions = $role->permissions;
        foreach($this->newRolePermissions as $permission){
            $this->searchAndUnset($rolePermissions, $permission);
        }
        $role->permissions = $rolePermissions;
        $role->save();

        $role = Role::where('name', 'studio-admin')->firstOrFail();
        $rolePermissions = $role->permissions;
        foreach($this->newRolePermissions as $permission){
            $this->searchAndUnset($rolePermissions, $permission);
        }
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
