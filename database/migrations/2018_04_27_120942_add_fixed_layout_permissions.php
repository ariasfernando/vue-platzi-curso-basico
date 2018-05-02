<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class AddFixedLayoutPermissions extends Migration
{
    private $permissions = [
        ['name' => 'create_campaign', 'description' => 'Allow user to create a brand new campaign.'],
        ['name' => 'clone_campaign', 'description' => 'Allow user to clone a regular campaign as opposed to clone only fixed layout templates.'],
        ['name' => 'create_template', 'description' => 'Allow users to create campaign templates.'],
        ['name' => 'fix_layout', 'description' => 'Allow users to create fixed layout campaigns.'],
    ];

    private $roles = ['admin', 'stensul-internal', 'user'];

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

        if ($roles = Role::whereIn('name', $this->roles)->get()) {
            foreach ($roles as $role) {
                $permissions = $role->permissions;

                $new_permissions = array_map(function ($perm) {
                    return $perm['name'];
                }, $this->permissions);

                $permissions = array_merge($permissions, $new_permissions);
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
        $names_to_delete = array_map(function ($row) {
            return $row['name'];
        }, $this->permissions);

        Permission::whereIn('name', $names_to_delete)->delete();

        if ($roles = Role::whereIn('name', $this->roles)->get()) {
            foreach ($roles as $role) {
                $permissions = $role->permissions;
                $permissions = array_diff($permissions, $names_to_delete);
                $role->permissions = $permissions;
                $role->save();
            }
        }
    }
}
