<?php

use Stensul\Providers\HelperServiceProvider as Helper;

/*
|--------------------------------------------------------------------------
| Application Menu
|--------------------------------------------------------------------------
|
| Configuration file for the application menu and modules to load.
|
*/

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    'default' => [
        'thin_ad_block' => [
            'title' => 'Thin Ad Block',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'thin_ad_block',
            'level' => 'single'
        ],

        'two_column_media_with_ad' => [
            'title' => 'Content Block + Ad Unit',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'two_column_media_with_ad',
            'level' => 'single'
        ],

        'three_column_media' => [
            'title' => '3 Column Content Blocks',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'three_column_media',
            'level' => 'single'
        ],

        'auto_image' => [
            'title' => 'Auto Image',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'auto_image',
            'level' => 'single',
        ],

        'line_of_text' => [
            'title' => 'Line of text',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'line_of_text',
            'level' => 'single'
        ],

        'thin_gray_line_separator' => [
            'title' => 'Thin Gray Line Separator',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'thin_gray_line_separator',
            'level' => 'single'
        ],

        'image_button' => [
            'title' => 'Primary Button',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'image_button',
            'level' => 'single'
        ],

        'header_text' => [
            'title' => 'Header Text',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'header_text',
            'level' => 'single'
        ],

        'title_text' => [
            'title' => 'Title Text',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'title_text',
            'level' => 'single'
        ],

        'free_range_text_paragraph' => [
            'title' => 'Free Range Text Paragraph',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'free_range_text_paragraph',
            'level' => 'single'
        ],

        'custom_table' => [
            'title' => 'Table Module',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'custom_table',
            'level' => 'single'
        ],

        'two_columns' => [
            'title' => 'Two Columns',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'two_columns',
            'level' => 'single',
        ],
        'text_with_image' => [
            'title' => 'Text + CTA Button + Image',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'text_with_image',
            'level' => 'single'
        ],

        'two_column_media_shared_height' => [
            'title' => 'Two Columns Shared Height',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'two_column_media_shared_height',
            'level' => 'single'
        ],

        'double_text_editor' => [
            'title' => 'Double tinyMCE Editor',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'double_text_editor',
            'level' => 'single'
        ]
    ]
];

$array_extend = require 'recursive.php';

foreach ($array_extend as $key_style => $value_style) {
    if ($key_style !== 'default') {
        foreach ($array_extend[$key_style] as $key_module => $value_module) {
            if (isset($array_extend["default"][$key_module])) {
                $array_extend[$key_style][$key_module] = Helper::arrayMergeRecursiveDistinct(
                    $array_extend["default"][$key_module],
                    $array_extend[$key_style][$key_module]
                );
            }
        }
    }
}

return $array_extend;
