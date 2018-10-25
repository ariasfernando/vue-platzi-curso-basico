<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class CreatePermissionsStudio extends Migration
{

    private $permissions = [
        ['name' => 'std_raw'],

        // MODULE PERMISSIONS


        ['name' => 'std-module_background_bgcolor', 'description' => ''],
        ['name' => 'std-module_padding_padding', 'description' => ''],
        ['name' => 'std-module_border_border-group', 'description' => ''],
        ['name' => 'std-module_style_classes', 'description' => ''],
        ['name' => 'std-module_stacking_column-stacking', 'description' => ''],

        ['name' => 'std-plugin-module-background-color', 'description' => ''],
        ['name' => 'std-plugin-module-equal-height-for-column', 'description' => ''],
        ['name' => 'std-plugin-module-height-sync', 'description' => ''],
        ['name' => 'std-plugin-module-palette-background-color', 'description' => ''],
        ['name' => 'std-plugin-toggle-element', 'description' => ''],
        ['name' => 'std-plugin-text-color-by-background-for-module', 'description' => ''],

        // COLUMN PERMISSIONS
        ['name' => 'std-column_background_bgcolor', 'description' => ''],
        ['name' => 'std-column_padding_padding', 'description' => ''],
        ['name' => 'std-column_border_border-group', 'description' => ''],
        ['name' => 'std-column_style_width', 'description' => ''],
        ['name' => 'std-column_style_classes', 'description' => ''],

        ['name' => 'std-column-plugin-column-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-column-palette-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-vertical-alignment', 'description' => ''],
        ['name' => 'std-column-plugin-text-color-by-background', 'description' => ''],

        // TEXT ELEMENT PERMISSIONS
        ['name' => 'std-text-element_font_font-family', 'description' => ''],
        ['name' => 'std-text-element_font_font-style', 'description' => ''],
        ['name' => 'std-text-element_font_letter-spacing', 'description' => ''],
        ['name' => 'std-text-element_font_font-weight', 'description' => ''],
        ['name' => 'std-text-element_font_align', 'description' => ''],
        ['name' => 'std-text-element_font_classes', 'description' => ''],
        ['name' => 'std-text-element_styles_bgcolor', 'description' => ''],
        ['name' => 'std-text-element_styles_color', 'description' => ''],
        ['name' => 'std-text-element_padding_padding', 'description' => ''],

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
        ['name' => 'std-button-element_font_font-family', 'description' => ''],
        ['name' => 'std-button-element_font_font-style', 'description' => ''],
        ['name' => 'std-button-element_font_letter-spacing', 'description' => ''],
        ['name' => 'std-button-element_font_font-weight', 'description' => ''],
        ['name' => 'std-button-element_textAlignment_text-align', 'description' => ''],
        ['name' => 'std-button-element_style_classes', 'description' => ''],
        ['name' => 'std-button-element_style_bgcolor', 'description' => ''],
        ['name' => 'std-button-element_style_generic-color', 'description' => ''],
        ['name' => 'std-button-element_style_padding', 'description' => ''],
        ['name' => 'std-button-element_style_border-radius', 'description' => ''],
        ['name' => 'std-button-element_border_border-group', 'description' => ''],
        ['name' => 'std-button-element_dimentions_width', 'description' => ''],
        ['name' => 'std-button-element_dimentions_height', 'description' => ''],
        ['name' => 'std-button-element_url_href', 'description' => ''],
        ['name' => 'std-button-element_caret_caret', 'description' => ''],
        ['name' => 'std-button-element_caret_image-size', 'description' => ''],
        ['name' => 'std-button-element_caret_classes', 'description' => ''],
        ['name' => 'std-button-element_caret_bgcolor', 'description' => ''],
        ['name' => 'std-button-element_caret_padding', 'description' => ''],

        ['name' => 'std-button-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-validate', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-validations', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-target', 'description' => ''],
        ['name' => 'std-button-element-plugin-font-family', 'description' => ''],
        ['name' => 'std-button-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-text-options', 'description' => ''],
        

        // IMAGE ELEMENT PERMISSIONS
        ['name' => 'std-image-element_placeholder_placeholder-desktop', 'description' => ''],
        ['name' => 'std-image-element_placeholder_placeholder-mobile', 'description' => ''],
        ['name' => 'std-image-element_placeholder_classes', 'description' => ''],
        ['name' => 'std-image-element_image_image-size', 'description' => ''],
        ['name' => 'std-image-element_text_text-align', 'description' => ''],
        ['name' => 'std-image-element_background_bgcolor', 'description' => ''],
        ['name' => 'std-image-element_padding_padding', 'description' => ''],
        ['name' => 'std-image-element_url_href', 'description' => ''],
        ['name' => 'std-image-element_url_alt', 'description' => ''],


        ['name' => 'std-image-element-plugin-alignment', 'description' => ''],
        ['name' => 'std-image-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url-validate', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url-validations', 'description' => ''],
        ['name' => 'std-image-element-plugin-destination-url-target', 'description' => ''],
        ['name' => 'std-image-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-image-element-plugin-style-image-editor', 'description' => ''],
       
        
        // IMAGE EDITOR PERMISSIONS
        ['name' => 'std-image-element_editor_library', 'description' => ''],
        ['name' => 'std-image-element_editor_url', 'description' => ''],
        ['name' => 'std-image-element_editor_sie-size', 'description' => ''],
        ['name' => 'std-image-element_editor_size_width', 'description' => ''],
        ['name' => 'std-image-element_editor_size_height', 'description' => ''],
        ['name' => 'std-image-element_editor_size_auto', 'description' => ''],
        ['name' => 'std-image-element_editor_size_minHeight', 'description' => ''],
        ['name' => 'std-image-element_editor_size_maxHeight', 'description' => ''],
        ['name' => 'std-image-element_editor_size_fit', 'description' => ''],
        ['name' => 'std-image-element_editor_size_minWidth', 'description' => ''],
        ['name' => 'std-image-element_editor_smaller', 'description' => ''],
        ['name' => 'std-image-element_editor_adjust', 'description' => ''],
        ['name' => 'std-image-element_editor_sie-plugin-image_upload', 'description' => ''],
        ['name' => 'std-image-element_editor_uploaddefault', 'description' => ''],
        ['name' => 'std-image-element_editor_fillcolor', 'description' => ''],
        ['name' => 'std-image-element_editor_sie-plugin-image_cropper', 'description' => ''],
        ['name' => 'std-image-element_editor_movable', 'description' => ''],
        ['name' => 'std-image-element_editor_rotatable', 'description' => ''],
        ['name' => 'std-image-element_editor_zoomable', 'description' => ''],
        ['name' => 'std-image-element_editor_vertical', 'description' => ''],
        ['name' => 'std-image-element_editor_round', 'description' => ''],
        ['name' => 'std-image-element_editor_plugin-mobile-upload', 'description' => ''],
        ['name' => 'std-image-element_editor_sie-plugin-text_text', 'description' => ''],
        ['name' => 'std-image-element_editor_sie-plugin-image-overlay_image', 'description' => ''],
        ['name' => 'std-image-element_editor_sie-plugin-shapemask_options', 'description' => ''],

        
        // DIVIDER ELEMENT PERMISSIONS
        ['name' => 'std-divider-element-classesGroup-classes', 'description' => ''],
        ['name' => 'std-divider-element-StyleSettingsGroup-bgcolor', 'description' => ''],
        ['name' => 'std-divider-element-StyleSettingsGroup-height', 'description' => ''],
        ['name' => 'std-divider-element-paddingGroup-padding', 'description' => ''],
        ['name' => 'std-divider-element-borderGroup-border-group', 'description' => ''],
        ['name' => 'std-divider-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-divider-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-divider-element-plugin-variable-height', 'description' => ''],


        // CUSTOM CODE PERMISSIONS
        ['name' => 'std-custom-code-element_settings_data', 'description' => ''],
        ['name' => 'std-custom-code-element_settings_classes', 'description' => ''],
        ['name' => 'std-custom-code-element_settings_bgcolor', 'description' => ''],
        ['name' => 'std-custom-code-element_settings_padding', 'description' => ''],
        ['name' => 'std-custom-code-element_border_border-group', 'description' => ''],
        ['name' => 'std-custom-code-element_settings_data', 'description' => ''],
        ['name' => 'std-custom-code-element_settings_classes', 'description' => ''],
        ['name' => 'std-custom-code-element_settings_bgcolor', 'description' => ''],
        ['name' => 'std-custom-code-element_settings_padding', 'description' => ''],
        ['name' => 'std-custom-code-element_border_border-group', 'description' => ''],


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
