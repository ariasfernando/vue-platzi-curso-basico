<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class CreatePermissionsStudio extends Migration
{

    private $permissions = [
        ['name' => 'std_raw'],
        ['name' => 'std-module-generic-color', 'description' => ''],
        ['name' => 'std-module-padding-group', 'description' => ''],
        ['name' => 'std-module-border-group', 'description' => ''],
        ['name' => 'std-module-class-input', 'description' => ''],
        ['name' => 'std-module-columns-stacking', 'description' => ''],
        ['name' => 'std-plugin-module-background-color', 'description' => ''],
        ['name' => 'std-plugin-module-equal-height-for-column', 'description' => ''],
        ['name' => 'std-plugin-module-height-sync', 'description' => ''],
        ['name' => 'std-plugin-module-palette-background-color', 'description' => ''],
        ['name' => 'std-plugin-toggle-element', 'description' => ''],
        ['name' => 'std-plugin-text-color-by-background-for-module', 'description' => ''],

        ['name' => 'std-column-generic-color', 'description' => ''],
        ['name' => 'std-column-padding-group', 'description' => ''],
        ['name' => 'std-column-border-group', 'description' => ''],
        ['name' => 'std-column-width', 'description' => ''],
        ['name' => 'std-column-class-input', 'description' => ''],
        ['name' => 'std-column-plugin-module-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-module-equal-height-for-column', 'description' => ''],
        ['name' => 'std-column-plugin-module-height-sync', 'description' => ''],
        ['name' => 'std-column-plugin-module-palette-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-toggle-element', 'description' => ''],
        ['name' => 'std-column-plugin-text-color-by-background-for-module', 'description' => ''],

        ['name' => 'std-text-element-font-family', 'description' => ''],
        ['name' => 'std-text-element-font-style', 'description' => ''],
        ['name' => 'std-text-element-letter-spacing', 'description' => ''],
        ['name' => 'std-text-element-font-weight', 'description' => ''],
        ['name' => 'std-text-element-text-align', 'description' => ''],
        ['name' => 'std-text-element-class-input', 'description' => ''],
        ['name' => 'std-text-element-generic-color', 'description' => ''],
        ['name' => 'std-text-element-padding-group', 'description' => ''],
        ['name' => 'std-text-element-padding-group', 'description' => ''],
        ['name' => 'std-text-element-plugin-alignment', 'description' => ''],
        ['name' => 'std-text-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-text-element-plugin-font-family', 'description' => ''],
        ['name' => 'std-text-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-text-element-plugin-text-options', 'description' => ''],

        ['name' => 'std-button-element-font-family', 'description' => ''],
        ['name' => 'std-button-element-font-style', 'description' => ''],
        ['name' => 'std-button-element-letter-spacing', 'description' => ''],
        ['name' => 'std-button-element-font-weight', 'description' => ''],
        ['name' => 'std-button-element-text-align', 'description' => ''],
        ['name' => 'std-button-element-border-group', 'description' => ''],
        ['name' => 'std-button-element-generic-number', 'description' => ''],
        ['name' => 'std-button-element-generic-text', 'description' => ''],
        ['name' => 'std-button-element-caret', 'description' => ''],
        ['name' => 'std-button-element-image-size', 'description' => ''],
        ['name' => 'std-button-element-class-input', 'description' => ''],
        ['name' => 'std-button-element-generic-color', 'description' => ''],
        ['name' => 'std-button-element-padding-group', 'description' => ''],
        ['name' => 'std-button-element-plugin-alignment', 'description' => ''],
        ['name' => 'std-button-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-button-element-plugin-font-family', 'description' => ''],
        ['name' => 'std-button-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-text-options', 'description' => ''],

        ['name' => 'std-image-element-generic-switch', 'description' => ''],
        ['name' => 'std-image-element-generic-file', 'description' => ''],
        ['name' => 'std-image-element-class-input', 'description' => ''],
        ['name' => 'std-image-element-image-size', 'description' => ''],
        ['name' => 'std-image-element-text-align', 'description' => ''],
        ['name' => 'std-image-element-generic-color', 'description' => ''],
        ['name' => 'std-image-element-padding-group', 'description' => ''],
        ['name' => 'std-image-element-generic-text', 'description' => ''],
        ['name' => 'std-image-element-plugin-alignment', 'description' => ''],
        ['name' => 'std-image-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-image-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-style-image-editor', 'description' => ''],

        ['name' => 'std-divider-element-class-input', 'description' => ''],
        ['name' => 'std-divider-element-generic-color', 'description' => ''],
        ['name' => 'std-divider-element-generic-number', 'description' => ''],
        ['name' => 'std-divider-element-padding-group', 'description' => ''],
        ['name' => 'std-divider-element-border-group', 'description' => ''],
        ['name' => 'std-divider-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-divider-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-divider-element-plugin-variable-height', 'description' => ''],
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
