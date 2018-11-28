<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
class UpdatePermissionsStudioPalleteBackground extends Migration
{

    private $newPermissions = [
        ['name' => 'std-divider-element-plugin-palette-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-palette-background-color', 'description' => ''],
        ['name' => 'std-text-element-plugin-palette-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-palette-background-colo', 'description' => ''],
    ];
    private $oldPermissions = [
        ['name' => 'std-divider-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-text-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-pallete-background-colo', 'description' => ''],
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach ($this->newPermissions as $permission) {
            Permission::create($permission);
        }

        $names_to_delete = array_map(function ($row) {
            return $row['name'];
        }, $this->oldPermissions);
        Permission::whereIn('name', $names_to_delete)->delete();
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
        }, $this->newPermissions);
        Permission::whereIn('name', $names_to_delete)->delete();
        foreach ($this->oldPermissions as $permission) {
            Permission::create($permission);
        }
    }

}
