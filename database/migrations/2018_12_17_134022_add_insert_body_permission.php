<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class AddInsertBodyPermission extends Migration
{
    protected $permissions = [
        ['name' => 'access_append_body', 'description' => 'Allow user to append body HTML on the campaign editor'],
        ['name' => 'access_prepend_body', 'description' => 'Allow user to prepend body HTML on the campaign editor'],
    ];
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
        Permission::where('name', $names_to_delete)->delete();
    }
}
