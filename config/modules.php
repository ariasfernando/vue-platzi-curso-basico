<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$menu = require dirname(__FILE__) . DIRECTORY_SEPARATOR . 'menu.php';

$default = [
    'image_button' => [
        'title' => 'Primary Button',
        'module_id' => 'image_button',
        'file_parent' => 'base',
        'placeholder_image' => '/_common/images/{locale}/primary-button-placeholder.png'
    ],

    // Content
    'two_column_media' => [
        'title' => 'Two Column Media',
        'module_id' => 'two_column_media',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-320x240.png'
    ],
    'two_column_media_shared_height' => [
        'title' => 'Two Columns Shared Height',
        'module_id' => 'two_column_media_shared_height',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-320x240.png',
        'validate_image_height' => true
    ],
    'hero_image_v2_no_crop' => [
        'title' => 'Hero Image - no crop',
        'module_id' => 'hero_image_v2_no_crop',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'hero_image_v2_single_crop' => [
        'title' => 'Hero Image - single crop',
        'module_id' => 'hero_image_v2_single_crop',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'hero_image_v2_height_proportional' => [
        'title' => 'Adjustable Width',
        'module_id' => 'hero_image_v2_height_proportional',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'mie_v2_default_adjustable_height' => [
        'title' => 'Adjustable Height',
        'module_id' => 'mie_v2_default_adjustable_height',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'hero_image_mie_v2_library' => [
        'title' => 'Image Library',
        'module_id' => 'hero_image_mie_v2_library',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'hero_image_mie_v2_overlays' => [
        'title' => 'Image + Overlays',
        'app_name' => 'base',
        'module_id' => 'hero_image_mie_v2_overlays',
        'level' => 'single'
    ],
    'hero_image_mie_v2_rich_text_overlay' => [
        'title' => 'Image + Rich text',
        'app_name' => 'base',
        'module_id' => 'hero_image_mie_v2_rich_text_overlay',
        'level' => 'single'
    ],
    'hero_image_mie_v2_library_scraper_instagram' => [
        'title' => 'Instagram Scraper',
        'action' => 'add',
        'app_name' => 'base',
        'module_id' => 'hero_image_mie_v2_library_scraper_instagram',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png',
        'level' => 'single'
    ],
    'hero_image_mie_v2_library_scraper_blog' => [
        'title' => 'Blog Scraper',
        'action' => 'add',
        'app_name' => 'base',
        'module_id' => 'hero_image_mie_v2_library_scraper_blog',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png',
        'level' => 'single'
    ],
    'three_column_media' => [
        'title' => '3 Column Content Blocks',
        'module_id' => 'three_column_media',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-210x240.png'
    ],
    'line_of_text' => [
        'title' => 'Line of Text',
        'module_id' => 'line_of_text',
        'file_parent' => 'base',
        'initialized' => false,
        'plugins' => []
    ],
    'thin_ad_block' => [
        'title' => 'Thin Ad Block',
        'action' => 'add',
        'app_name' => 'base',
        'module_id' => 'thin_ad_block',
        'level' => 'single',
        'module_id' => 'thin_ad_block',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-320X50.png',
        'image_size' => [
            'image0' => [
                'width' => 320,
                'height' => 50
            ]
        ]
    ],
    'two_column_media_with_ad' => [
        'title' => 'Content Block + Ad Unit',
        'module_id' => 'two_column_media_with_ad',
        'file_parent' => 'base',
        'placeholder_image' => [
            'image0' => '/images/default/image-placeholder-320x240.png',
            'image1' => '/images/default/image-placeholder-300x250.png'
        ],
        'image_size' => [
            'image0' => [
                'width' => 320,
                'height' => 240
            ],
            'image1' => [
                'width' => 300,
                'height' => 250
            ]
        ]
    ],

    'thin_gray_line_separator' => [
        'title' => 'Thin Gray Line Separator',
        'file_parent' => 'base',
        'module_id' => 'thin_gray_line_separator'
    ],

    // Text Inline
    'free_range_text_paragraph' => [
        'title' => 'Free Range Text Paragraph',
        'module_id' => 'free_range_text_paragraph',
        'file_parent' => 'base',
        'max_lines' => '4',
        'initialized' => false,
        'toolbox' => [
            'colorPicker' => [
                'class' => "color-picker",
                'icon' => "tint",
                'color_default' => '#555555',
                'colors_list' => [
                    'DarkGray' => '#333333',
                    'gray' => '#595A5D',
                    'gray_2' => '#555555',
                    'red' => '#EC2127',
                    'red_2' => '#ED1C24',
                    'lightGray' => '#ECEDEE'
                ]
            ]
        ],
        'plugins' => [
            'tinymce' => [
                'formats' => [
                    'underline' => [
                        'inline' => 'u',
                        'exact' => true
                    ]
                ],
                'selector' => '.st-edit-text',
                'fixed_toolbar_container' => '.text-overlay .text-overlay-toolbox',
                'toolbar' => 'bold italic underline link forecolor',
                'plugins' => 'paste advlist autolink lists stlinkextended textcolor',
                'forced_root_block' => false,
                'inline' => true,
                'forced_root_block' => false,
                'target_list' => false,
                'link_validate_url' => true,
                'link_title' => false,
                'link_text_to_display' => false,
                'paste_as_text' => true,
                'menubar' => false,
                'relative_urls' => false,
                'remove_script_host' => false,
                'textcolor_rows' => 1,
                'textcolor_map' => [
                    '000000', 'Black',
                    '666666', 'Gray',
                    'FFFFFF', 'White',
                    'EC2127', 'Red',
                    '3c763d', 'Green',
                    '0715c3', 'Blue',
                    'ec971f', 'Orange'
                ],
                'invalid_elements' => 'img'
            ]
        ]
    ],

    'header_text' => [
        'title' => 'Header Text',
        'module_id' => 'header_text',
        'file_parent' => 'base',
        'initialized' => false,
        'toolbox' => [],
        'plugins' => [
            'tinymce' => [
                'selector' => '.st-edit-text',
                'fixed_toolbar_container' => '.text-overlay .text-overlay-toolbox',
                'toolbar' => 'forecolor',
                'plugins' => 'paste textcolor',
                'forced_root_block' => false,
                'inline' => true,
                'paste_as_text' => true,
                'menubar' => false,
                'relative_urls' => false,
                'textcolor_rows' => 1,
                'textcolor_map' => [
                    '000000', 'Black',
                    '666666', 'Gray',
                    'FFFFFF', 'White',
                    'EC2127', 'Red',
                    '3c763d', 'Green',
                    '0715c3', 'Blue',
                    'ec971f', 'Orange'
                ],
                'invalid_elements' => 'img'
            ]
        ]
    ],

    'title_text' => [
        'title' => 'Title Text',
        'module_id' => 'title_text',
        'file_parent' => 'base',
        'initialized' => false,
        'toolbox' => [],
        'plugins' => [
            'tinymce' => [
                'selector' => '.st-edit-text',
                'fixed_toolbar_container' => '.text-overlay .text-overlay-toolbox',
                'toolbar' => 'forecolor',
                'plugins' => 'paste textcolor',
                'forced_root_block' => false,
                'inline' => true,
                'paste_as_text' => true,
                'menubar' => false,
                'relative_urls' => false,
                'textcolor_rows' => 1,
                'textcolor_map' => [
                    '000000', 'Black',
                    '666666', 'Gray',
                    'FFFFFF', 'White',
                    'EC2127', 'Red',
                    '3c763d', 'Green',
                    '0715c3', 'Blue',
                    'ec971f', 'Orange'
                ],
                'invalid_elements' => 'img'
            ]
        ]
    ],

    'custom_table' => [
        'title' => 'Table Module',
        'module_id' => 'custom_table',
        'file_parent' => 'base',
        'gutter_space' => 20,
        'default_table_data' => [
            [
                [
                    "value"=>"Header 1",
                    "width"=>330
                ],
                ["value"=>"Header 2"]
            ],
            [
                ["value"=>"Cell 1"],
                ["value"=>"Cell 2"]
            ]

        ],
        'header_background' => '#E9EAEA',
        'th_css_class' => 'width-auto',
        'th_style_attr' => 'padding:0 4px;line-height:19px;color:#595a5d;'
            . 'font-weight:bold;font-size:13px;box-sizing:border-box;',
        'td_style_attr' => 'padding:0 4px;height:20px;line-height:19px;'
            . 'font-size:13px;color:#595a5d;box-sizing:border-box;'
    ],

    'section_header' => [
        'title' => 'Section Header',
        'module_id' => 'section_header',
        'file_parent' => 'base',
        'background_colors' => [
            'default' => '#FFFFFF',
            'list' => [
                'White' => '#FFFFFF',
                'Primary Gray' => '#E4E5E3',
                'Supporting Gray' => '#F6F6F6'
            ]
        ]
    ],

    'image_plus_text' => [
        'title' => 'Image + Text',
        'module_id' => 'image_plus_text',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-318x153.png',
        'image_size' => [
            'image0' => [
                'width' => 318,
                'height' => 153
            ]
        ]
    ],

    'auto_image' => [
        'title' => 'Auto Image',
        'module_id' => 'auto_image',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x98.png'
    ],

    'image_plus_text_flipped' => [
        'title' => 'Image + Text',
        'module_id' => 'image_plus_text_flipped',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-318x153.png',
        'image_size' => [
            'image0' => [
                'width' => 318,
                'height' => 153
            ]
        ]
    ],

    'header_text_with_body' => [
        'title' => 'Header Text with Body',
        'module_id' => 'header_text_with_body',
        'file_parent' => 'base',
        'background_colors' => [
            'default' => '#ffffff',
            'list' => [
                'White' => '#ffffff',
                'Supporting Gray' => '#f6f6f6'
            ]
        ]
    ],

    'colored_bar' => [
        'title' => 'Colored Bar',
        'module_id' => 'colored_bar',
        'file_parent' => 'base',
        'background_colors' => [
            'default' => '#673AB7',
            'list' => [
                'White' => '#FFFFFF',
                'Gray' => '#E4E5E3',
                'Light Gray' => '#F6F6F6',
                'Red' => '#DB4437',
                'Pink' => '#E91E63',
                'Purple' => '#9C27B0',
                'Deep Purple' => '#673AB7',
                'Blue' => '#3F51B5',
                'Green' => '#4CAF50'
            ]
        ]
    ],
    'two_columns' => [
        'title' => 'Two Columns',
        'module_id' => 'two_columns',
        'file_parent' => 'base',
        'placeholder_image_button' => '/_common/images/{locale}/primary-button-placeholder.png',
        'placeholder_image' => '/images/default/image-placeholder-242x90.png',
        'initialized' => false,
        'plugins' => [
            'tinymce' => [
                'formats' => [
                    'underline' => [
                        'inline' => 'u',
                        'exact' => true
                    ]
                ],
                'selector' => '.st-edit-text',
                'fixed_toolbar_container' => '.text-overlay .text-overlay-toolbox',
                'toolbar' => 'bold italic underline link bullist',
                'plugins' => 'paste advlist autolink lists stlinkextended',
                'advlist_bullet_styles' => 'circle',
                'forced_root_block' => false,
                'inline' => true,
                'target_list' => false,
                'link_title' => false,
                'paste_as_text' => true,
                'menubar' => false,
                'link_validate_url' => true,
                'relative_urls' => false,
                'remove_script_host' => false,
                'invalid_elements' => 'img'
            ]
        ]
    ],
    'text_with_image' => [
        'title' => 'Text + CTA Button + Image',
        'module_id' => 'text_with_image',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-175x131.png',
        'button' => [
            'background_colors' => [
                'default' => '#FFFFFF',
                'list' => [
                    'White' => '#FFFFFF',
                    '@hex' => '%%=v(@hex)=%%'
                ]
            ],
            'font_colors' => [
                'default' => '#000000',
                'list' => [
                    'Black' => '#000000',
                    'White' => '#FFFFFF',
                    '@hex' => '%%=v(@hex)=%%'
                ]
            ]
        ],
        'initialized' => false,
        'plugins' => [
           'tinymce' => [
               'formats' => [
                   'underline' => [
                       'inline' => 'u',
                       'exact' => true
                   ]
               ],
               'selector' => '.st-edit-text',
               'fixed_toolbar_container' => '.text-overlay .text-overlay-toolbox',
               'toolbar' => 'bold italic underline link fontsizeselect',
               'plugins' => 'paste advlist autolink lists stlinkextended',
               'fontsize_formats' => '14px 16px 22px',
               'forced_root_block' => false,
               'inline' => true,
               'target_list' => false,
               'link_validate_url' => true,
               'link_title' => false,
               'link_text_to_display' => false,
               'paste_as_text' => true,
               'menubar' => false,
               'relative_urls' => false,
                'remove_script_host' => false,
                'invalid_elements' => 'img'
           ]
        ]
    ],
    'double_text_editor' => [
        'title' => 'Double tinyMCE Editor',
        'action' => 'add',
        'app_name' => 'base',
        'module_id' => 'double_text_editor',
        'level' => 'single',
        'file_parent' => 'base',
        'initialized' => false,
        'plugins' => [
            'tinymce' => [
                [
                    'formats' => [
                        'underline' => [
                            'inline' => 'u',
                            'exact' => true
                        ]
                    ],
                    'selector' => '.st-subtitle-text',
                    'content_selector' => '.st-sutbitle-text-overlay',
                    'fixed_toolbar_container' => '.st-sutbitle-text-overlay .text-overlay-toolbox',
                    'toolbar' => 'bold italic underline link alignleft aligncenter',
                    'plugins' => 'paste advlist autolink lists stlinkextended',
                    'forced_root_block' => 'div',
                    'inline' => true,
                    'target_list' => false,
                    'link_validate_url' => true,
                    'link_title' => false,
                    'link_text_to_display' => false,
                    'paste_as_text' => true,
                    'menubar' => false,
                    'relative_urls' => false,
                    'remove_script_host' => false
                ],[
                    'formats' => [
                        'underline' => [
                            'inline' => 'u',
                            'exact' => true
                        ]
                    ],
                    'selector' => '.st-title-text',
                    'content_selector' => '.st-title-text-overlay',
                    'fixed_toolbar_container' => '.st-title-text-overlay .text-overlay-toolbox',
                    'toolbar' => 'alignleft aligncenter',
                    'plugins' => 'paste advlist autolink lists stlinkextended',
                    'forced_root_block' => 'div',
                    'inline' => true,
                    'target_list' => false,
                    'link_validate_url' => true,
                    'link_title' => false,
                    'link_text_to_display' => false,
                    'paste_as_text' => true,
                    'menubar' => false,
                    'relative_urls' => false,
                    'remove_script_host' => false
                ]
            ]
        ]
    ]
];

// Load new module config.
foreach ($menu as $library => $modules) {
    foreach ($modules as $module_config) {
        if (!isset($module_config['class']) || $module_config['class'] !== 'pkg') {
            continue;
        }

        if ($config = file_get_contents($app->basePath() . '/resources/views/' . strtolower(env('APP_NAME'))
            . '/modules/' . $module_config['module_id'] . '/config.json')) {
            $default[$module_config['module_id']] = json_decode($config, true);
        }
    }
}

return require 'recursive.php';
