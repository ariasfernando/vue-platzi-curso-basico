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
        'std-module-backgroundColorGroup-bgcolor',
        'std-module-paddingGroup-padding',
        'std-module-borderGroup-border-group',
        'std-module-classesAndColumnStackingGroup-classes',
        'std-module-classesAndColumnStackingGroup-columnsStacking',
        'std-plugin-module-background-color',
        'std-plugin-module-equal-height-for-column',
        'std-plugin-module-height-sync',
        'std-plugin-module-palette-background-color',
        'std-plugin-toggle-element',
        'std-plugin-text-color-by-background-for-module',

        // COLUMN PERMISSIONS
        'std-column-backgroundColorGroup-bgcolor',
        'std-column-paddingGroup-padding',
        'std-column-borderGroup-border-group',
        'std-column-widthAndClassGroup-width',
        'std-column-widthAndClassGroup-classes',
        'std-column-plugin-column-background-color',
        'std-column-plugin-column-palette-background-color',
        'std-column-plugin-vertical-alignment',
        'std-column-plugin-text-color-by-background',

        // TEXT ELEMENT PERMISSIONS
        'std-text-element-fontFamilyGroup-fontFamily',
        'std-text-element-fontAndStylesGroup-font-style',
        'std-text-element-fontAndStylesGroup-letterSpacing',
        'std-text-element-fontAndStylesGroup-fontWeight',
        'std-text-element-fontAndStylesGroup-align',
        'std-text-element-fontAndStylesGroup-classes',
        'std-text-element-colorStyles-bgcolor',
        'std-text-element-colorStyles-color',
        'std-module-backgroundColorGroup-bgcolor',
        'std-module-paddingGroup-padding',
        'std-module-borderGroup-border-group',
        'std-module-classesAndColumnStackingGroup-classes',
        'std-module-classesAndColumnStackingGroup-columnsStacking',
        'std-plugin-module-background-color',
        'std-plugin-module-equal-height-for-column',
        'std-plugin-module-height-sync',
        'std-plugin-module-palette-background-color',
        'std-plugin-toggle-element',
        'std-plugin-text-color-by-background-for-module',

        // COLUMN PERMISSIONS
        'std-column-backgroundColorGroup-bgcolor',
        'std-column-paddingGroup-padding',
        'std-column-borderGroup-border-group',
        'std-column-widthAndClassGroup-width',
        'std-column-widthAndClassGroup-classes',
        'std-column-plugin-column-background-color',
        'std-column-plugin-column-palette-background-color',
        'std-column-plugin-vertical-alignment',
        'std-column-plugin-text-color-by-background',

        // TEXT ELEMENT PERMISSIONS
        'std-text-element-fontFamilyGroup-fontFamily',
        'std-text-element-fontAndStylesGroup-font-style',
        'std-text-element-fontAndStylesGroup-letterSpacing',
        'std-text-element-fontAndStylesGroup-fontWeight',
        'std-text-element-fontAndStylesGroup-align',
        'std-text-element-fontAndStylesGroup-classes',
        'std-text-element-colorStyles-bgcolor',
        'std-text-element-colorStyles-color',
        'std-text-element-paddingGroup-padding',
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
        'std-button-element-fontSettingsGroup-fontFamily',
        'std-button-element-fontSettingsGroup-font-style',
        'std-button-element-fontSettingsGroup-letter-spacing',
        'std-button-element-fontSettingsGroup-font-weight',
        'std-button-element-textAlignmentGroup-text-align',
        'std-button-element-classStyleGroup-classes',
        'std-button-element-classStyleGroup-bgcolor',
        'std-button-element-classStyleGroup-color',
        'std-button-element-paddingBorderRadiusGroup-padding',
        'std-button-element-paddingBorderRadiusGroup-borderRadius',
        'std-button-element-borderGroup-border-group',
        'std-button-element-dimentionsGroup-width',
        'std-button-element-dimentionsGroup-height',
        'std-button-element-defaultUrlGroup-href',
        'std-button-element-caretGroup-caret',
        'std-button-element-caretGroup-image-size',
        'std-button-element-caretGroup-classes',
        'std-button-element-caretGroup-bgcolor',
        'std-button-element-caretGroup-padding',
        'std-button-element-plugin-background-color',
        'std-button-element-plugin-destination-url',
        'std-button-element-plugin-destination-url-validate',
        'std-button-element-plugin-destination-url-validations',
        'std-button-element-plugin-destination-url-target',
        'std-button-element-plugin-font-family',
        'std-button-element-plugin-pallete-background-color',
        'std-button-element-plugin-text-options',
        

        // IMAGE ELEMENT PERMISSIONS
        'std-image-element-placeholderGroup-placeholder',
        'std-image-element-placeholderGroup-placeholderMobile',
        'std-image-element-placeholderGroup-classes',
        'std-image-element-imageSizeGroup-image-size',
        'std-image-element-textAlignGroup-text-align',
        'std-image-element-backgroundColorGroup-bgcolor',
        'std-image-element-paddingGroup-padding',
        'std-image-element-urlGroup-href',
        'std-image-element-urlGroup-alt',
        'std-image-element-plugin-alignment',
        'std-image-element-plugin-background-color',
        'std-image-element-plugin-destination-url',
        'std-image-element-plugin-destination-url-validate',
        'std-image-element-plugin-destination-url-validations',
        'std-image-element-plugin-destination-url-target',
        'std-image-element-plugin-pallete-background-color',
        'std-image-element-plugin-style-image-editor',
        
        // IMAGE EDITOR PERMISSIONS
        'std-image-element-editor-library',
        'std-image-element-editor-url',
        'std-image-element-editor-sie-size',
        'std-image-element-editor-size_width',
        'std-image-element-editor-size_height',
        'std-image-element-editor-size_auto',
        'std-image-element-editor-size_minHeight',
        'std-image-element-editor-size_maxHeight',
        'std-image-element-editor-size_fit',
        'std-image-element-editor-size_minWidth',
        'std-image-element-editor-smaller',
        'std-image-element-editor-adjust',
        'std-image-element-editor-sie-plugin-image_upload',
        'std-image-element-editor-uploaddefault',
        'std-image-element-editor-fillcolor',
        'std-image-element-editor-sie-plugin-image_cropper',
        'std-image-element-editor-movable',
        'std-image-element-editor-rotatable',
        'std-image-element-editor-zoomable',
        'std-image-element-editor-vertical',
        'std-image-element-editor-round',
        'std-image-element-editor-sie-plugin-text_text',
        'std-image-element-editor-sie-plugin-image-overlay_image',
        'std-image-element-editor-sie-plugin-shapemask_options',

        // DIVIDER ELEMENT PERMISSIONS
        'std-divider-element-classesGroup-classes',
        'std-divider-element-StyleSettingsGroup-bgcolor',
        'std-divider-element-StyleSettingsGroup-height',
        'std-divider-element-paddingGroup-padding',
        'std-divider-element-borderGroup-border-group',
        'std-divider-element-plugin-background-color',
        'std-divider-element-plugin-pallete-background-color',
        'std-divider-element-plugin-variable-height'
        ];

        // Remove permissions for advanced user
        $advancedPermissions = $allPermissions;
        $this->unsetPermission($advancedPermissions, 'std_raw');

        // Remove permissions for basic user
        $basicPermissions = $allPermissions;
        $this->unsetPermission($basicPermissions, 'std_raw');
        $this->unsetPermission($basicPermissions, 'std-module-classesAndColumnStackingGroup-classes');
        $this->unsetPermission($basicPermissions, 'std-plugin-text-color-by-background-for-module');
        
        $this->unsetPermission($basicPermissions, 'std-column-widthAndClassGroup-classes');
        $this->unsetPermission($basicPermissions, 'std-column-plugin-vertical-alignment');
        $this->unsetPermission($basicPermissions, 'std-column-plugin-text-color-by-background');

        $this->unsetPermission($basicPermissions, 'std-divider-element-borderGroup-border-group');
        $this->unsetPermission($basicPermissions, 'std-divider-element-classesGroup-classes');
        
        $this->unsetPermission($basicPermissions, 'std-text-element-fontAndStylesGroup-classes');
        $this->unsetPermission($basicPermissions, 'tiny-plugin-link_fixed_color');
        
        $this->unsetPermission($basicPermissions, 'std-button-element-classStyleGroup-classes');
        $this->unsetPermission($basicPermissions, 'std-button-element-caret');
        $this->unsetPermission($basicPermissions, 'std-button-element-caretGroup-caret');
        $this->unsetPermission($basicPermissions, 'std-button-element-caretGroup-image-size');
        $this->unsetPermission($basicPermissions, 'std-button-element-caretGroup-classes');
        $this->unsetPermission($basicPermissions, 'std-button-element-caretGroup-bgcolor');
        $this->unsetPermission($basicPermissions, 'std-button-element-caretGroup-padding');
        $this->unsetPermission($basicPermissions, 'std-button-element-plugin-destination-url-target');
        
        $this->unsetPermission($basicPermissions, 'std-image-element-placeholderGroup-classes');        
        $this->unsetPermission($basicPermissions, 'std-image-element-plugin-destination-url-target');

        $this->unsetPermission($basicPermissions,'std-image-element-editor-library');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-url');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-sie-size');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-size_width');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-size_height');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-size_auto');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-size_minHeight');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-size_maxHeight');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-size_fit');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-size_minWidth');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-smaller');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-adjust');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-sie-plugin-image_upload');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-plugin-mobile-upload');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-uploaddefault');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-fillcolor');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-rotatable');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-sie-plugin-text_text');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-sie-plugin-image-overlay_image');
        $this->unsetPermission($basicPermissions,'std-image-element-editor-sie-plugin-shapemask_options');
 

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
