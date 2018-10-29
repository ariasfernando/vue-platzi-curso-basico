<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class UpdatePermissionsRoleAssignmentStudioDestinationUrl extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         // ADMIN
         // add std-text-element-plugin-toggle-element-setter
         $role = Role::where('name', 'studio-admin')->firstOrFail();
         $rolePermissions = $role->permissions;
         $rolePermissions[] = 'std-text-element-plugin-destination-url';
         $rolePermissions[] = 'std-text-element-plugin-destination-url-validate';
         $rolePermissions[] = 'std-text-element-plugin-destination-url-validations';
         $rolePermissions[] = 'std-text-element-plugin-destination-url-target';
         $role->permissions = $rolePermissions;
         $role->save();

         // ADVANCED
         // add std-text-element-plugin-toggle-element-setter
         $role = Role::where('name', 'studio-advanced')->firstOrFail();
         $rolePermissions = $role->permissions;
         $rolePermissions[] = 'std-text-element-plugin-destination-url';
         $rolePermissions[] = 'std-text-element-plugin-destination-url-validate';
         $rolePermissions[] = 'std-text-element-plugin-destination-url-validations';
         $rolePermissions[] = 'std-text-element-plugin-destination-url-target';
         $role->permissions = $rolePermissions;
         $role->save();

        // USER
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $rolePermissions[] = 'std-text-element-plugin-destination-url';
        $rolePermissions[] = 'std-text-element-plugin-destination-url-validate';
        $rolePermissions[] = 'std-text-element-plugin-destination-url-validations';
        $rolePermissions[] = 'std-text-element-plugin-destination-url-target';
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
        // remove std-divider-element-plugin-toggle-element-setter
        $role = Role::where('name', 'studio-admin')->firstOrFail();
        $rolePermissions = $role->permissions;
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-destination-url');
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-destination-url-validate');
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-destination-url-validations');
        $this->searchAndUnset($rolePermissions, 'std-text-element-plugin-destination-url-target');
        $role->permissions = $rolePermissions;
        $role->save();

        // ADVANCED
        // remove std-divider-element-plugin-toggle-element-setter
        $role = Role::where('name', 'studio-advanced')->firstOrFail();
        $rolePermissions = $role->permissions;
        $this->searchAndUnset($rolePermissions, 'sstd-text-element-plugin-destination-url');
        $this->searchAndUnset($rolePermissions, 'sstd-text-element-plugin-destination-url-validate');
        $this->searchAndUnset($rolePermissions, 'sstd-text-element-plugin-destination-url-validations');
        $this->searchAndUnset($rolePermissions, 'sstd-text-element-plugin-destination-url-target');
        $role->permissions = $rolePermissions;
        $role->save();

        // USER
        // add std-divider-element-plugin-toggle-element-setter
        $role = Role::where('name', 'studio-user')->firstOrFail();
        $rolePermissions = $role->permissions;
        $this->searchAndUnset($rolePermissions, 'ststd-text-element-plugin-destination-url');
        $this->searchAndUnset($rolePermissions, 'ststd-text-element-plugin-destination-url-validate');
        $this->searchAndUnset($rolePermissions, 'ststd-text-element-plugin-destination-url-validations');
        $this->searchAndUnset($rolePermissions, 'ststd-text-element-plugin-destination-url-target');
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
