<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class CreateStudioRoles extends Migration
{
    private $roles = [
        ['name' => 'studio-admin', 'description' => 'Full access to every option'],
        ['name' => 'studio-user', 'description' => 'Restricted access to studio functionalities'],
        ['name' => 'studio-advanced', 'description' => 'Higher level access to studio'],
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach ($this->roles as $role) {
            Role::create($role);
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
        }, $this->roles);
        Role::whereIn('name', $names_to_delete)->delete();
    }
}