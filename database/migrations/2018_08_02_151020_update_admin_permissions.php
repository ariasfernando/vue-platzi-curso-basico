<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class UpdateAdminPermissions extends Migration
{
    private $permissions = [
        [
            'name' => 'access_admin_studio_libraries',
            'description' => 'Allow user to access library section in Studio.'
        ],
        [
            'name' => 'access_admin_studio_modules',
            'description' => 'Allow user to access module section in Studio.'
        ],
        [
            'name' => 'allows_role_change',
            'description' => 'Allow user to change roles to another users.'
        ]
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach ($this->permissions as $permission) {
            if (Permission::where('name', $permission['name'])->first() === null) {
                Permission::create($permission);
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
    }
}
