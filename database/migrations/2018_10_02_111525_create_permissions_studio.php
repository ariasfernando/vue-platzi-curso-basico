<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;

class CreatePermissionsStudio extends Migration
{

    private $permissions = [
        ['name' => 'std_raw'],

        // MODULE PERMISSIONS
        ['name' => 'std-module-backgroundColorGroup-bgcolor', 'description' => ''],
        ['name' => 'std-module-paddingGroup-padding', 'description' => ''],
        ['name' => 'std-module-borderGroup-border-group', 'description' => ''],
        ['name' => 'std-module-classesAndColumnStackingGroup-classes', 'description' => ''],
        ['name' => 'std-module-classesAndColumnStackingGroup-columnsStacking', 'description' => ''],

        ['name' => 'std-plugin-module-background-color', 'description' => ''],
        ['name' => 'std-plugin-module-equal-height-for-column', 'description' => ''],
        ['name' => 'std-plugin-module-height-sync', 'description' => ''],
        ['name' => 'std-plugin-module-palette-background-color', 'description' => ''],
        ['name' => 'std-plugin-toggle-element', 'description' => ''],
        ['name' => 'std-plugin-text-color-by-background-for-module', 'description' => ''],

        // COLUMN PERMISSIONS
        ['name' => 'std-column-backgroundColorGroup-bgcolor', 'description' => ''],
        ['name' => 'std-column-paddingGroup-padding', 'description' => ''],
        ['name' => 'std-column-borderGroup-border-group', 'description' => ''],
        ['name' => 'std-column-widthAndClassGroup-width', 'description' => ''],
        ['name' => 'std-column-widthAndClassGroup-classes', 'description' => ''],

        ['name' => 'std-column-plugin-column-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-column-palette-background-color', 'description' => ''],
        ['name' => 'std-column-plugin-vertical-alignment', 'description' => ''],
        ['name' => 'std-column-plugin-text-color-by-background', 'description' => ''],

        // TEXT ELEMENT PERMISSIONS
        ['name' => 'std-text-element-fontFamilyGroup-fontFamily', 'description' => ''],
        ['name' => 'std-text-element-fontAndStylesGroup-font-style', 'description' => ''],
        ['name' => 'std-text-element-fontAndStylesGroup-letterSpacing', 'description' => ''],
        ['name' => 'std-text-element-fontAndStylesGroup-fontWeight', 'description' => ''],
        ['name' => 'std-text-element-fontAndStylesGroup-align', 'description' => ''],
        ['name' => 'std-text-element-fontAndStylesGroup-classes', 'description' => ''],
        ['name' => 'std-text-element-colorStyles-bgcolor', 'description' => ''],
        ['name' => 'std-text-element-colorStyles-color', 'description' => ''],
        ['name' => 'std-text-element-paddingGroup-padding', 'description' => ''],

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
        ['name' => 'std-button-element-fontSettingsGroup-fontFamily', 'description' => ''],
        ['name' => 'std-button-element-fontSettingsGroup-font-style', 'description' => ''],
        ['name' => 'std-button-element-fontSettingsGroup-letter-spacing', 'description' => ''],
        ['name' => 'std-button-element-fontSettingsGroup-font-weight', 'description' => ''],
        ['name' => 'std-button-element-textAlignmentGroup-text-align', 'description' => ''],
        ['name' => 'std-button-element-classStyleGroup-classes', 'description' => ''],
        ['name' => 'std-button-element-classStyleGroup-bgcolor', 'description' => ''],
        ['name' => 'std-button-element-classStyleGroup-color', 'description' => ''],
        ['name' => 'std-button-element-paddingBorderRadiusGroup-padding', 'description' => ''],
        ['name' => 'std-button-element-paddingBorderRadiusGroup-borderRadius', 'description' => ''],
        ['name' => 'std-button-element-borderGroup-border-group', 'description' => ''],
        ['name' => 'std-button-element-dimentionsGroup-width', 'description' => ''],
        ['name' => 'std-button-element-dimentionsGroup-height', 'description' => ''],
        ['name' => 'std-button-element-defaultUrlGroup-href', 'description' => ''],
        ['name' => 'std-button-element-caretGroup-caret', 'description' => ''],
        ['name' => 'std-button-element-caretGroup-image-size', 'description' => ''],
        ['name' => 'std-button-element-caretGroup-classes', 'description' => ''],
        ['name' => 'std-button-element-caretGroup-bgcolor', 'description' => ''],
        ['name' => 'std-button-element-caretGroup-padding', 'description' => ''],

        ['name' => 'std-button-element-plugin-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-validate', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-validations', 'description' => ''],
        ['name' => 'std-button-element-plugin-destination-url-target', 'description' => ''],
        ['name' => 'std-button-element-plugin-font-family', 'description' => ''],
        ['name' => 'std-button-element-plugin-pallete-background-color', 'description' => ''],
        ['name' => 'std-button-element-plugin-text-options', 'description' => ''],
        

        // IMAGE ELEMENT PERMISSIONS
        ['name' =>'std-image-element-placeholderGroup-placeholder', 'description' => ''],
        ['name' =>'std-image-element-placeholderGroup-placeholderMobile', 'description' => ''],
        ['name' =>'std-image-element-placeholderGroup-classes', 'description' => ''],
        ['name' =>'std-image-element-imageSizeGroup-image-size', 'description' => ''],
        ['name' =>'std-image-element-textAlignGroup-text-align', 'description' => ''],
        ['name' =>'std-image-element-backgroundColorGroup-bgcolor', 'description' => ''],
        ['name' =>'std-image-element-paddingGroup-padding', 'description' => ''],
        ['name' =>'std-image-element-urlGroup-href', 'description' => ''],
        ['name' =>'std-image-element-urlGroup-alt', 'description' => ''],


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
        ['name' => 'std-divider-element-classesGroup-classes', 'description' => ''],
        ['name' => 'std-divider-element-StyleSettingsGroup-bgcolor', 'description' => ''],
        ['name' => 'std-divider-element-StyleSettingsGroup-height', 'description' => ''],
        ['name' => 'std-divider-element-paddingGroup-padding', 'description' => ''],
        ['name' => 'std-divider-element-borderGroup-border-group', 'description' => ''],
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
