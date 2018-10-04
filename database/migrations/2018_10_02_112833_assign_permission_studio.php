<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class AssignPermissionStudio extends Migration
{
    private function buildPermissions()
    {

        $allPermissions = [
            'std_raw',
            'std-module-generic-color',
            'std-module-padding-group',
            'std-module-border-group',
            'std-module-class-input',
            'std-module-columns-stacking',
            'std-plugin-module-background-color',
            'std-plugin-module-equal-height-for-column',
            'std-plugin-module-height-sync',
            'std-plugin-module-palette-background-color',
            'std-plugin-toggle-element',
            'std-plugin-text-color-by-background-for-module',
    
            'std-column-generic-color',
            'std-column-padding-group',
            'std-column-border-group',
            'std-column-width',
            'std-column-class-input',
            'std-column-plugin-module-background-color',
            'std-column-plugin-module-equal-height-for-column',
            'std-column-plugin-module-height-sync',
            'std-column-plugin-module-palette-background-color',
            'std-column-plugin-toggle-element',
            'std-column-plugin-text-color-by-background-for-module',
    
            'std-text-element-font-family',
            'std-text-element-font-style',
            'std-text-element-letter-spacing',
            'std-text-element-font-weight',
            'std-text-element-text-align',
            'std-text-element-class-input',
            'std-text-element-generic-color',
            'std-text-element-padding-group',
            'std-text-element-padding-group',
            'std-text-element-plugin-alignment',
            'std-text-element-plugin-background-color',
            'std-text-element-plugin-font-family',
            'std-text-element-plugin-pallete-background-color',
            'std-text-element-plugin-text-options',
    
            'std-button-element-font-family',
            'std-button-element-font-style',
            'std-button-element-letter-spacing',
            'std-button-element-font-weight',
            'std-button-element-text-align',
            'std-button-element-border-group',
            'std-button-element-generic-number',
            'std-button-element-generic-text',
            'std-button-element-caret',
            'std-button-element-image-size',
            'std-button-element-class-input',
            'std-button-element-generic-color',
            'std-button-element-padding-group',
            'std-button-element-plugin-alignment',
            'std-button-element-plugin-background-color',
            'std-button-element-plugin-destination-url',
            'std-button-element-plugin-font-family',
            'std-button-element-plugin-pallete-background-color',
            'std-button-element-plugin-text-options',
    
            'std-image-element-generic-switch',
            'std-image-element-generic-file',
            'std-image-element-class-input',
            'std-image-element-image-size',
            'std-image-element-text-align',
            'std-image-element-generic-color',
            'std-image-element-padding-group',
            'std-image-element-generic-text',
            'std-image-element-plugin-alignment',
            'std-image-element-plugin-background-color',
            'std-image-element-plugin-destination-url',
            'std-image-element-plugin-pallete-background-color',
            'std-image-element-plugin-style-image-editor',
    
            'std-divider-element-class-input',
            'std-divider-element-generic-color',
            'std-divider-element-generic-number',
            'std-divider-element-padding-group',
            'std-divider-element-border-group',
            'std-divider-element-plugin-background-color',
            'std-divider-element-plugin-pallete-background-color',
            'std-divider-element-plugin-variable-height',
        ];

        // Remove permissions for advanced user
        $advancedPermissions = $allPermissions;
        $this->unsetPermission($advancedPermissions, 'std_raw');

        // Remove permissions for basic user
        $basicPermissions = $allPermissions;
        $this->unsetPermission($basicPermissions, 'std_raw');
        $this->unsetPermission($basicPermissions, 'std-plugin-text-color-by-background-for-module');
        $this->unsetPermission($basicPermissions, 'std-column-plugin-text-color-by-background-for-module');
        $this->unsetPermission($basicPermissions, 'std-divider-element-border-group');
        $this->unsetPermission($basicPermissions, 'std-module-class-input');
        $this->unsetPermission($basicPermissions, 'std-column-class-input');
        $this->unsetPermission($basicPermissions, 'std-text-element-class-input');
        $this->unsetPermission($basicPermissions, 'std-button-element-class-input');
        $this->unsetPermission($basicPermissions, 'std-image-element-class-input');
        $this->unsetPermission($basicPermissions, 'std-divider-element-class-input');

        $roles_permissions = [
            'studio-admin' => $allPermissions,
            'studio-advanced' => $advancedPermissions,
            'studio-user' => $basicPermissions,
        ];

        return $roles_permissions;
    }

    function unsetPermission(&$arr, $perm){
        if (($key = array_search($perm, $arr)) !== false) {
            unset($arr[$key]);
        }
    }

    /**
     * Assign permissions to studio roles.
     *
     * @return void
     */
    public function up()
    {
        $permissionAssignment = $this->buildPermissions();
        foreach ($permissionAssignment as $role_name => $permissions) {
            $role = Role::where('name', '=', $role_name)->first();
            if ($role) {
                $permissions = array_unique(array_merge($role->permissions, $permissions));
                $role->permissions = $permissions;
                $role->save();
            }
        }

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $permissionAssignment = $this->buildPermissions();
        foreach ($permissionAssignment as $role_name => $permissions) {
            $role = Role::where('name', '=', $role_name)->first();
            if ($role) {
                $permissions = array_diff($role->permissions, $permissions);
                $role->permissions = $permissions;
                $role->save();
            }
        }
    }
}
