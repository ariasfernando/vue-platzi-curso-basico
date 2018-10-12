<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Permission;
use Stensul\Models\Role;

class AssignPermissionStudio extends Migration
{
    private function buildPermissions()
    {

        $allPermissions = [
        'std_raw',

        // MODULE PERMISSIONS
        'std-module_background_bgcolor',
        'std-module_padding_padding',
        'std-module_border_border-group',
        'std-module_style_classes',
        'std-module_stacking_column-stacking',

        'std-plugin-module-background-color',
        'std-plugin-module-equal-height-for-column',
        'std-plugin-module-height-sync',
        'std-plugin-module-palette-background-color',
        'std-plugin-toggle-element',
        'std-plugin-text-color-by-background-for-module',

        // COLUMN PERMISSIONS
        'std-column_background_bgcolor',
        'std-column_padding_padding',
        'std-column_border_border-group',
        'std-column_style_width',
        'std-column_style_classes',
        'std-column-plugin-column-background-color',
        'std-column-plugin-column-palette-background-color',
        'std-column-plugin-vertical-alignment',
        'std-column-plugin-text-color-by-background',

        // TEXT ELEMENT PERMISSIONS
        'std-text-element_font_font-family',
        'std-text-element_font_font-style',
        'std-text-element_font_letter-spacing',
        'std-text-element_font_font-weight',
        'std-text-element_font_align',
        'std-text-element_font_classes',
        'std-text-element_styles_bgcolor',
        'std-text-element_styles_color',
        'std-text-element_padding_padding',

        'std-text-element-plugin-alignment',
        'std-text-element-plugin-background-color',
        'std-text-element-plugin-font-family',
        'std-text-element-plugin-pallete-background-color',
        'std-text-element-plugin-text-options',

        // TINY MCE PLUGIN PERMISSIONS (GLOBAL)
        // DEPENDS ON (std-text-element-plugin-text-options || std-button-element-plugin-text-options)
        'tiny-plugin-link_validate_url',
        'tiny-plugin-truncate',
        'tiny-plugin-lines_limit',
        'tiny-plugin-fontsize_formats',
        'tiny-plugin-style_formats',
        'tiny-plugin-link_fixed_color',
        'tiny-plugin-st_formats_menu',
        'tiny-plugin-formats',
        'tiny-plugin-forecolor-palette',
        'tiny-plugin-forecolor-palette-library',

        // BUTTON ELEMENT PERMISSIONS
        'std-button-element_font_font-family',
        'std-button-element_font_font-style',
        'std-button-element_font_letter-spacing',
        'std-button-element_font_font-weight',
        'std-button-element_textAlignment_text-align',
        'std-button-element_style_classes',
        'std-button-element_style_bgcolor',
        'std-button-element_style_generic-color',
        'std-button-element_style_padding',
        'std-button-element_style_border-radius',
        'std-button-element_border_border-group',
        'std-button-element_dimentions_width',
        'std-button-element_dimentions_height',
        'std-button-element_url_href',
        'std-button-element_caret_caret',
        'std-button-element_caret_image-size',
        'std-button-element_caret_classes',
        'std-button-element_caret_bgcolor',
        'std-button-element_caret_padding',

        'std-button-element-plugin-background-color',
        'std-button-element-plugin-destination-url',
        'std-button-element-plugin-destination-url-validate',
        'std-button-element-plugin-destination-url-validations',
        'std-button-element-plugin-destination-url-target',
        'std-button-element-plugin-font-family',
        'std-button-element-plugin-pallete-background-color',
        'std-button-element-plugin-text-options',
        

        // IMAGE ELEMENT PERMISSIONS
        'std-image-element_placeholder_placeholder-desktop',
        'std-image-element_placeholder_placeholder-mobile',
        'std-image-element_placeholder_classes',
        'std-image-element_image_image-size',
        'std-image-element_text_text-align',
        'std-image-element_background_bgcolor',
        'std-image-element_padding_padding',
        'std-image-element_url_href',
        'std-image-element_url_alt',


        'std-image-element-plugin-alignment',
        'std-image-element-plugin-background-color',
        'std-image-element-plugin-destination-url',
        'std-image-element-plugin-destination-url-validate',
        'std-image-element-plugin-destination-url-validations',
        'std-image-element-plugin-destination-url-target',
        'std-image-element-plugin-pallete-background-color',
        'std-image-element-plugin-style-image-editor',
        
        // IMAGE EDITOR PERMISSIONS
        'std-image-element_editor_library',
        'std-image-element_editor_url',
        'std-image-element_editor_sie-size',
        'std-image-element_editor_size_width',
        'std-image-element_editor_size_height',
        'std-image-element_editor_size_auto',
        'std-image-element_editor_size_minHeight',
        'std-image-element_editor_size_maxHeight',
        'std-image-element_editor_size_fit',
        'std-image-element_editor_size_minWidth',
        'std-image-element_editor_smaller',
        'std-image-element_editor_adjust',
        'std-image-element_editor_sie-plugin-image_upload',
        'std-image-element_editor_uploaddefault',
        'std-image-element_editor_fillcolor',
        'std-image-element_editor_sie-plugin-image_cropper',
        'std-image-element_editor_movable',
        'std-image-element_editor_rotatable',
        'std-image-element_editor_zoomable',
        'std-image-element_editor_vertical',
        'std-image-element_editor_round',
        'std-image-element_editor_sie-plugin-text_text',
        'std-image-element_editor_sie-plugin-image-overlay_image',
        'std-image-element_editor_sie-plugin-shapemask_options',

        // DIVIDER ELEMENT PERMISSIONS
        'std-divider-element_classes_classes',
        'std-divider-element_style_bgcolor',
        'std-divider-element_style_inner-bgcolor',
        'std-divider-element_style_height',
        'std-divider-element_padding_padding',
        'std-divider-element_border_border-group',

        'std-divider-element-plugin-background-color',
        'std-divider-element-plugin-pallete-background-color',
        'std-divider-element-plugin-variable-height',


        // CUSTOM CODE PERMISSIONS
        'std-custom-code-element_settings_data',
        'std-custom-code-element_settings_classes',
        'std-custom-code-element_settings_bgcolor',
        'std-custom-code-element_settings_padding',
        'std-custom-code-element_border_border-group',
        'std-custom-code-element_settings_data',
        'std-custom-code-element_settings_classes',
        'std-custom-code-element_settings_bgcolor',
        'std-custom-code-element_settings_padding',
        'std-custom-code-element_border_border-group',
    ];


        

        // Remove permissions for advanced user
        $advancedPermissions = $allPermissions;
        $this->unsetPermission($advancedPermissions, 'std_raw');

        // Remove permissions for basic user
        $basicPermissions = $allPermissions;
        $this->unsetPermission($basicPermissions, 'std_raw');
        $this->unsetPermission($basicPermissions, 'std-module_style_classes');
        $this->unsetPermission($basicPermissions, 'std-plugin-text-color-by-background-for-module');
        
        $this->unsetPermission($basicPermissions, 'std-column_style_classes');
        $this->unsetPermission($basicPermissions, 'std-column-plugin-vertical-alignment');
        $this->unsetPermission($basicPermissions, 'std-column-plugin-text-color-by-background');

        $this->unsetPermission($basicPermissions, 'std-divider-element_border_border-group');
        $this->unsetPermission($basicPermissions, 'std-divider-element_classes_classes');
        
        $this->unsetPermission($basicPermissions, 'std-text-element_font_classes');
        $this->unsetPermission($basicPermissions, 'tiny-plugin-link_fixed_color');
        
        $this->unsetPermission($basicPermissions, 'std-button-element_style_classes');
        $this->unsetPermission($basicPermissions, 'std-button-element_caret_caret');
        $this->unsetPermission($basicPermissions, 'std-button-element_caret_image-size');
        $this->unsetPermission($basicPermissions, 'std-button-element_caret_classes');
        $this->unsetPermission($basicPermissions, 'std-button-element_caret_bgcolor');
        $this->unsetPermission($basicPermissions, 'std-button-element_caret_padding');
        $this->unsetPermission($basicPermissions, 'std-button-element-plugin-destination-url-target');
        
        $this->unsetPermission($basicPermissions, 'std-image-element_placeholder_classes');        
        $this->unsetPermission($basicPermissions, 'std-image-element-plugin-destination-url-target');

        $this->unsetPermission($basicPermissions,'std-image-element_editor_library');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_url');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_sie-size');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_size_width');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_size_height');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_size_auto');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_size_minHeight');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_size_maxHeight');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_size_fit');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_size_minWidth');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_smaller');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_adjust');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_sie-plugin-image_upload');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_plugin-mobile-upload');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_uploaddefault');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_fillcolor');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_rotatable');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_sie-plugin-text_text');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_sie-plugin-image-overlay_image');
        $this->unsetPermission($basicPermissions,'std-image-element_editor_sie-plugin-shapemask_options');
 
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_data');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_classes');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_bgcolor');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_padding');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_border_border-group');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_data');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_classes');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_bgcolor');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_settings_padding');
        $this->unsetPermission($basicPermissions,'std-custom-code-element_border_border-group');


        $roles_permissions = [
            'studio-admin' => $allPermissions,
            'studio-advanced' => $advancedPermissions,
            'studio-user' => $basicPermissions,
        ];

        return $roles_permissions;
    }

    public function unsetPermission(&$arr, $perm)
    {
        if (($key = array_search($perm, $arr)) !== false) {
            unset($arr[$key]);
        }
    }

    /**
     * Assign permissions to studio roles.
     *
     * @return void
     */
    public function up()
    {
        $permissionAssignment = $this->buildPermissions();
        foreach ($permissionAssignment as $role_name => $permissions) {
            $role = Role::where('name', '=', $role_name)->first();
            if ($role) {
                $permissions = array_unique(array_merge($role->permissions, $permissions));
                $role->permissions = $permissions;
                $role->save();
            }
        }

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $permissionAssignment = $this->buildPermissions();
        foreach ($permissionAssignment as $role_name => $permissions) {
            $role = Role::where('name', '=', $role_name)->first();
            if ($role) {
                $permissions = array_diff($role->permissions, $permissions);
                $role->permissions = $permissions;
                $role->save();
            }
        }
    }
}
