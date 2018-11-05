<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class AddPermissionsStudioAcl extends Migration
{
    private $permissions = [
        ['name' => 'std-image-element_editor_text_visible', 'description' => ''],
        ['name' => 'std-image-element_editor_text_default', 'description' => ''],
        ['name' => 'std-image-element_editor_text_description', 'description' => ''],
        ['name' => 'std-image-element_editor_text_top', 'description' => ''],
        ['name' => 'std-image-element_editor_text_left', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_visible', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_default', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_gallery', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_change', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_width', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_height', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_resizable', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_absolute', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_top', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_left', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_relative', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_fixed', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_follow', 'description' => ''],
        ['name' => 'std-image-element_editor_overlay_description', 'description' => ''],
        ['name' => 'std-image-element_editor_shapemask_visible', 'description' => ''],
        ['name' => 'std-image-element_editor_transparencycolor', 'description' => ''],
        ['name' => 'std-image-element_editor_transparency', 'description' => ''],
        ['name' => 'std-image-element_editor_shapemask_square', 'description' => ''],
        ['name' => 'std-image-element_editor_shapemask_circle', 'description' => '']
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
