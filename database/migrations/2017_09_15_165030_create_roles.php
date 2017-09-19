<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;

class CreateRoles extends Migration
{
    private $roles = [
        ['name' => 'stensul-internal', 'description' => 'Stensul Internal Role'],
        ['name' => 'user', 'description' => 'User Role'],
        ['name' => 'master', 'description' => 'Master Role'],
        ['name' => 'admin', 'description' => 'Admin Role'],
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
        $names_to_delete = array_map(function($row){ return $row['name']; }, $this->roles);
        Role::whereIn('name',$names_to_delete)->delete();
    }
}
