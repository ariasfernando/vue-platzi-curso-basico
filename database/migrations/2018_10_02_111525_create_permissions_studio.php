<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class CreatePermissionsStudio extends Migration
{

    private $permissions = [
        ['name' => 'std_raw'],

        // MODULE PERMISSIONS
        ['name' => 'std-module-bgcolor', 'description' => ''],
        ['name' => 'std-module-padding', 'description' => ''],
        ['name' => 'std-module-border-group', 'description' => ''],
        ['name' => 'std-module-classes', 'description' => ''],
        ['name' => 'std-module-columnsStacking', 'description' => ''],
        ['name' => 'std-plugin-module-background-color', 'description' => ''],
        ['name' => 'std-plugin-module-equal-height-for-column', 'description' => ''],
        ['name' => 'std-plugin-module-height-sync', 'description' => ''],
        ['name' => 'std-plugin-module-palette-background-color', 'description' => ''],
        ['name' => 'std-plugin-toggle-element', 'description' => ''],
        ['name' => 'std-plugin-text-color-by-background-for-module', 'description' => ''],

        // COLUMN PERMISSIONS
        ['name' => 'std-column-bgcolor', 'description' => ''],
        ['name' => 'std-column-padding', 'description' => ''],
        ['name' => 'std-column-border-group', 'description' => ''],
        ['name' => 'std-column-width', 'description' => ''],
        ['name' => 'std-column-classes', 'description' => ''],
        ['name' => 'std-column-plugin-column-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-column-palette-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-vertical-alignment', 'description' => ''],
        ['name' => 'std-column-plugin-text-color-by-background', 'description' => ''],

        // TEXT ELEMENT PERMISSIONS
        ['name' => 'std-text-element-fontFamily', 'description' => ''],
        ['name' => 'std-text-element-font-style', 'description' => ''],
        ['name' => 'std-text-element-letterSpacing', 'description' => ''],
        ['name' => 'std-text-element-fontWeight', 'description' => ''],
        ['name' => 'std-text-element-align', 'description' => ''],
        ['name' => 'std-text-element-classes', 'description' => ''],
        ['name' => 'std-text-element-bgcolor', 'description' => ''],
        ['name' => 'std-text-element-color', 'description' => ''],
        ['name' => 'std-text-element-padding', 'description' => ''],
        ['name' => 'std-text-element-plugin-alignment', 'description' => ''],
        ['name' => 'std-text-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-text-element-plugin-font-family', 'description' => ''],
        ['name' => 'std-text-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-text-element-plugin-text-options', 'description' => ''],

        // TINY MCE PLUGIN PERMISSIONS (GLOBAL)
        // DEPENDS ON (std-text-element-plugin-text-options || std-button-element-plugin-text-options)
        ['name' => 'tiny-plugin-link_validate_url', 'description' => ''],
        ['name' => 'tiny-plugin-truncate', 'description' => ''],
        ['name' => 'tiny-plugin-lines_limit', 'description' => ''],
        ['name' => 'tiny-plugin-fontsize_formats', 'description' => ''],
        ['name' => 'tiny-plugin-style_formats', 'description' => ''],
        ['name' => 'tiny-plugin-link_fixed_color', 'description' => ''],
        ['name' => 'tiny-plugin-st_formats_menu', 'description' => ''],
        ['name' => 'tiny-plugin-formats', 'description' => ''],
        ['name' => 'tiny-plugin-forecolor-palette', 'description' => ''],
        ['name' => 'tiny-plugin-forecolor-palette-library', 'description' => ''],

        // BUTTON ELEMENT PERMISSIONS
        ['name' => 'std-button-element-fontFamily', 'description' => ''],
        ['name' => 'std-button-element-font-style', 'description' => ''],
        ['name' => 'std-button-element-letter-spacing', 'description' => ''],
        ['name' => 'std-button-element-font-weight', 'description' => ''],
        ['name' => 'std-button-element-text-align', 'description' => ''],
        ['name' => 'std-button-element-classes', 'description' => ''],
        ['name' => 'std-button-element-bgcolor', 'description' => ''],
        ['name' => 'std-button-element-color', 'description' => ''],
        ['name' => 'std-button-element-padding', 'description' => ''],
        ['name' => 'std-button-element-borderRadius', 'description' => ''],
        ['name' => 'std-button-element-border-group', 'description' => ''],
        ['name' => 'std-button-element-width', 'description' => ''],
        ['name' => 'std-button-element-maxWidth', 'description' => ''],
        ['name' => 'std-button-element-minWidth', 'description' => ''],
        ['name' => 'std-button-element-height', 'description' => ''],
        ['name' => 'std-button-element-href', 'description' => ''],
        ['name' => 'std-button-element-caret', 'description' => ''],
        ['name' => 'std-button-element-image-size', 'description' => ''],
        ['name' => 'std-button-element-classes', 'description' => ''],
        ['name' => 'std-button-element-bgcolor', 'description' => ''],
        ['name' => 'std-button-element-padding', 'description' => ''],
        ['name' => 'std-button-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-validate', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-validations', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-target', 'description' => ''],
        ['name' => 'std-button-element-plugin-font-family', 'description' => ''],
        ['name' => 'std-button-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-text-options', 'description' => ''],
        

        // IMAGE ELEMENT PERMISSIONS
        ['name' => 'std-image-element-placeholder', 'description' => ''],
        ['name' => 'std-image-element-hasImageMobile', 'description' => ''],
        ['name' => 'std-image-element-placeholderMobile', 'description' => ''],
        ['name' => 'std-image-element-classes', 'description' => ''],
        ['name' => 'std-image-element-image-size', 'description' => ''],
        ['name' => 'std-image-element-text-align', 'description' => ''],
        ['name' => 'std-image-element-bgcolor', 'description' => ''],
        ['name' => 'std-image-element-padding', 'description' => ''],
        ['name' => 'std-image-element-href', 'description' => ''],
        ['name' => 'std-image-element-alt', 'description' => ''],
        ['name' => 'std-image-element-title', 'description' => ''],
        ['name' => 'std-image-element-plugin-alignment', 'description' => ''],
        ['name' => 'std-image-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-image-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-style-image-editor', 'description' => ''],
        ['name' => 'std-image-element-placeholder', 'description' => ''],
        ['name' => 'std-image-element-hasImageMobile', 'description' => ''],
        ['name' => 'std-image-element-placeholderMobile', 'description' => ''],
        ['name' => 'std-image-element-classes', 'description' => ''],
        ['name' => 'std-image-element-image-size', 'description' => ''],
        ['name' => 'std-image-element-text-align', 'description' => ''],
        ['name' => 'std-image-element-bgcolor', 'description' => ''],
        ['name' => 'std-image-element-padding', 'description' => ''],
        ['name' => 'std-image-element-href', 'description' => ''],
        ['name' => 'std-image-element-alt', 'description' => ''],
        ['name' => 'std-image-element-title', 'description' => ''],
        ['name' => 'std-image-element-plugin-alignment', 'description' => ''],
        ['name' => 'std-image-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url-validate', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url-validations', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url-target', 'description' => ''],
        ['name' => 'std-image-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-style-image-editor', 'description' => ''],
        
        // IMAGE EDITOR PERMISSIONS
        ['name' => 'std-image-element-editor-library', 'description' => ''],
        ['name' => 'std-image-element-editor-url', 'description' => ''],
        ['name' => 'std-image-element-editor-sie-size', 'description' => ''],
        ['name' => 'std-image-element-editor-size_width', 'description' => ''],
        ['name' => 'std-image-element-editor-size_height', 'description' => ''],
        ['name' => 'std-image-element-editor-size_auto', 'description' => ''],
        ['name' => 'std-image-element-editor-size_minHeight', 'description' => ''],
        ['name' => 'std-image-element-editor-size_maxHeight', 'description' => ''],
        ['name' => 'std-image-element-editor-size_fit', 'description' => ''],
        ['name' => 'std-image-element-editor-size_minWidth', 'description' => ''],
        ['name' => 'std-image-element-editor-smaller', 'description' => ''],
        ['name' => 'std-image-element-editor-adjust', 'description' => ''],
        ['name' => 'std-image-element-editor-sie-plugin-image_upload', 'description' => ''],
        ['name' => 'std-image-element-editor-uploaddefault', 'description' => ''],
        ['name' => 'std-image-element-editor-fillcolor', 'description' => ''],
        ['name' => 'std-image-element-editor-sie-plugin-image_cropper', 'description' => ''],
        ['name' => 'std-image-element-editor-movable', 'description' => ''],
        ['name' => 'std-image-element-editor-rotatable', 'description' => ''],
        ['name' => 'std-image-element-editor-zoomable', 'description' => ''],
        ['name' => 'std-image-element-editor-vertical', 'description' => ''],
        ['name' => 'std-image-element-editor-round', 'description' => ''],
        ['name' => 'std-image-element-editor-sie-plugin-text_text', 'description' => ''],
        ['name' => 'std-image-element-editor-sie-plugin-image-overlay_image', 'description' => ''],
        ['name' => 'std-image-element-editor-sie-plugin-shapemask_options', 'description' => ''],

        // DIVIDER ELEMENT PERMISSIONS
        ['name' => 'std-divider-element-classes', 'description' => ''],
        ['name' => 'std-divider-element-bgcolor', 'description' => ''],
        ['name' => 'std-divider-element-height', 'description' => ''],
        ['name' => 'std-divider-element-padding', 'description' => ''],
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
