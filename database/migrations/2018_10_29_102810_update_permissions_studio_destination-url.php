<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class UpdatePermissionsStudioDestinationUrl extends Migration
{

    private $permissions = [
        ['name' => 'std-text-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-text-element-plugin-destination-url-validate', 'description' => ''],
        ['name' => 'std-text-element-plugin-destination-url-validations', 'description' => ''],
        ['name' => 'std-text-element-plugin-destination-url-target', 'description' => ''],
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
        Permission::whereIn('name', $names_to_delete)->delete();
    }

}
