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
        'dadada' => [
            "module_id" => "dadada",
            "title" => "dadada",
            "app_name" => "base",
            "action" => "add",
            "level" => "single",
            "file_parent" => "base",
            "class" => "pkg",
        ],
        'view_in_browser' => [
            'title' => 'View in browser',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'view_in_browser',
            'level' => 'single',
            'class' => 'pkg',
        ],

        'header_image' => [
            'title' => 'Header Image',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'header_image',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'hero_image' => [
            'title' => 'Hero Image',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'hero_image',
            'level' => 'single',
            'class' => 'pkg'
        ],
        
        'hero_image_bg' => [
            'title' => 'Hero Image Background',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'hero_image_bg',
            'level' => 'single',
            'class' => 'pkg'
        ],

        'hero_image_mobile_version' => [
            'title' => 'Hero Image (mobile version)',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'hero_image_mobile_version',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'image_with_text' => [
            'title' => 'Image With Text',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'image_with_text',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'image_with_flipped' => [
            'title' => 'Image With Text - Flipped',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'image_with_text_flipped',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'two_column_media_with_text' => [
            'title' => 'Two Column Media With Text',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'two_column_media_with_text',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'three_column_media_with_text' => [
            'title' => 'Three Column Media With Text',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'three_column_media_with_text',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'free_text' => [
            'title' => 'Free Text',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'free_text',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'cta_button_image' => [
            'title' => 'Primary Button - Image',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'cta_button_image',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'cta_button_html' => [
            'title' => 'Primary Button - HTML',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'cta_button_html',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'spacer' => [
            'title' => 'Spacer',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'spacer',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'line_separator' => [
            'title' => 'Line Separator',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'line_separator',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'footer' => [
            'title' => 'Footer',
            'action' => 'add',
            'app_name' => 'base',
            'module_id' => 'footer',
            'class' => 'pkg',
            'level' => 'single'
        ],

        'hero_v2_group' => [
            'title' => 'Image Editor v2',
            'action' => 'expand',
            'level' => 'level-1',
            'module_id' => 'hero_v2_group',
            'sub_menu' => [
                'hero_image_v2_no_crop' => [
                    'title' => 'Hero Image - no crop',
                    'action' => 'add',
                    'app_name' => 'base',
                    'module_id' => 'hero_image_v2_no_crop',
                    'level' => 'single'
                ],
                'hero_image_v2_single_crop' => [
                    'title' => 'Hero Image - single crop',
                    'action' => 'add',
                    'app_name' => 'base',
                    'module_id' => 'hero_image_v2_single_crop',
                    'level' => 'single'
                ],
                'hero_image_v2_height_proportional' => [
                    'title' => 'Adjustable Width',
                    'action' => 'add',
                    'app_name' => 'base',
                    'module_id' => 'hero_image_v2_height_proportional',
                    'level' => 'single'
                ],
                'mie_v2_default_adjustable_height' => [
                    'title' => 'Adjustable Height',
                    'action' => 'add',
                    'app_name' => 'base',
                    'module_id' => 'mie_v2_default_adjustable_height',
                    'level' => 'single'
                ],
                'hero_image_mie_v2_library' => [
                    'title' => 'Image Library',
                    'action' => 'add',
                    'app_name' => 'base',
                    'module_id' => 'hero_image_mie_v2_library',
                    'level' => 'single'
                ]
            ]
        ],

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
