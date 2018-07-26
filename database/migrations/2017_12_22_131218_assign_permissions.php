<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class AssignPermissions extends Migration
{
    /**
     * Assign permissions to roles.
     *
     * @return void
     */
    public function up()
    {
        // Assign all permissions to admin role.
        $role = Role::where('name', '=', 'admin')->first();
        if ($role) {
            $permissions = Permission::all();
            $role_perms = [];
            foreach ($permissions as $permission) {
                $role_perms[] = $permission->name;
            }
            $role->permissions = $role_perms;
            $role->save();
        }

        $roles_permissions = [
            'user' => [
                'create_template',
                'clone_campaign',
                'create_campaign',
                'edit_campaign',
                'access_favorites',
                'access_dashboard',
                'access_unfixed_templates'
            ],
            'full' => [
                'create_template',
                'clone_campaign',
                'create_campaign',
                'edit_campaign',
                'access_favorites',
                'access_dashboard',
                'access_unfixed_templates',
                'access_proof',
                'edit_proof'
            ],
            'reviewer' => [
                'access_proof',
            ]
        ];

        foreach ($roles_permissions as $role_name => $permissions) {

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
    }
}
