<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [
    'image_button' => [
        'type' => 'image_button',
        'file_parent' => 'base',
        'placeholder_image' => '/_common/images/{locale}/primary-button-placeholder.png'
    ],
    // Header
    'header_image' => [
        'type' => 'header_image',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x98.png'
    ],
    'footer' => [
        'type' => 'footer',
        'file_parent' => 'base'
    ],

    // Content
    'two_column_media_with_text' => [
        'type' => 'two_column_media_with_text',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-320x240.png'
    ],
    'two_column_media' => [
        'type' => 'two_column_media',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-320x240.png'
    ],
    'two_column_media_shared_height' => [
        'type' => 'two_column_media_shared_height',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-320x240.png',
        'validate_image_height' => true
    ],
    'hero_image' => [
        'type' => 'hero_image',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png',
        'library_name' => 'test'
    ],
    'hero_image_bg' => [
        'type' => 'hero_image_bg',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png',
        'library_name' => 'test'
    ],
    'hero_image_mobile' => [
        'type' => 'hero_image_mobile',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png',
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
                    'red' => '#ED1C24',
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
                'toolbar' => 'bold italic underline link',
                'plugins' => 'paste advlist autolink lists stlinkextended',
                'forced_root_block' => false,
                'inline' => true,
                'target_list' => false,
                'link_validate_url' => true,
                'link_title' => false,
                'link_text_to_display' => false,
                'paste_as_text' => true,
                'menubar' => false,
                'relative_urls' => false
            ]
        ]
    ],
    'hero_image_bg' => [
        'type' => 'hero_image_bg',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png',
        'library_name' => 'test'
    ],
    'hero_image_v2_no_crop' => [
        'type' => 'hero_image_v2_no_crop',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'hero_image_v2_single_crop' => [
        'type' => 'hero_image_v2_single_crop',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'hero_image_v2_height_proportional' => [
        'type' => 'hero_image_v2_height_proportional',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'mie_v2_default_adjustable_height' => [
        'type' => 'mie_v2_default_adjustable_height',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'hero_image_mie_v2_library' => [
        'type' => 'hero_image_mie_v2_library',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x400.png'
    ],
    'three_column_media_with_text' => [
        'type' => 'three_column_media_with_text',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-210x240.png'
    ],
    'three_column_media' => [
        'type' => 'three_column_media',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-210x240.png'
    ],
    'line_of_text' => [
        'type' => 'line_of_text',
        'file_parent' => 'base',
        'initialized' => false,
        'plugins' => []
    ],
    'thin_ad_block' => [
        'type' => 'thin_ad_block',
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
        'type' => 'two_column_media_with_ad',
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

    // Spacers
    'spacer' => [
        'type' => 'spacer',
        'file_parent' => 'base',
        'sizes' => [
            'default' => 18,
            'list' => [
                10 => '10px',
                18 => '18px',
                20 => '20px',
                42 => '42px'
            ]
        ],
        'background_colors' => [
            'default' => '#FFFFFF',
            'list' => [
                'White' => '#FFFFFF',
                'Primary Gray' => '#E4E5E3',
                'Supporting Gray' => '#F6F6F6'
            ]
        ]
    ],
    'spacer_white_10' => [
        'type' => 'spacer_white_10',
        'file_parent' => 'base'
    ],
    'spacer_white_15' => [
        'type' => 'spacer_white_15',
        'file_parent' => 'base'
    ],
    'spacer_white_20' => [
        'type' => 'spacer_white_20',
        'file_parent' => 'base'
    ],

    'thin_gray_line_separator' => [
        'file_parent' => 'base',
        'type' => 'thin_gray_line_separator'
    ],

    // Text Inline
    'free_range_text_paragraph' => [
        'type' => 'free_range_text_paragraph',
        'file_parent' => 'base',
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
                'toolbar' => 'bold italic underline link',
                'plugins' => 'paste advlist autolink lists stlinkextended',
                'forced_root_block' => false,
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
    ],

    'header_text' => [
        'type' => 'header_text',
        'file_parent' => 'base',
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
                'selector' => '.st-edit-text',
                'fixed_toolbar_container' => '.text-overlay .text-overlay-toolbox',
                'toolbar' => false,
                'plugins' => 'paste',
                'forced_root_block' => false,
                'inline' => true,
                'paste_as_text' => true,
                'menubar' => false,
                'relative_urls' => false
            ]
        ]
    ],

    'title_text' => [
        'type' => 'title_text',
        'file_parent' => 'base',
        'initialized' => false,
        'toolbox' => [
            'colorPicker' => [
                'class' => "color-picker",
                'icon' => "tint",
                'color_default' => '#EC2127',
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
                'selector' => '.st-edit-text',
                'fixed_toolbar_container' => '.text-overlay .text-overlay-toolbox',
                'toolbar' => false,
                'plugins' => 'paste',
                'forced_root_block' => false,
                'inline' => true,
                'paste_as_text' => true,
                'menubar' => false,
                'relative_urls' => false
            ]
        ]
    ],

    'custom_table' => [
        'type' => 'custom_table',
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
        'type' => 'section_header',
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
        'type' => 'image_plus_text',
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
        'type' => 'auto_image',
        'file_parent' => 'base',
        'placeholder_image' => '/images/default/image-placeholder-660x98.png'
    ],

    'image_plus_text_flipped' => [
        'type' => 'image_plus_text_flipped',
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
        'type' => 'header_text_with_body',
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
        'type' => 'colored_bar',
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
        'type' => 'two_columns',
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
                'remove_script_host' => false
            ]
        ]
    ],
    'view_in_browser' => [
        'type' => 'view_in_browser',
        'file_parent' => 'base'
    ],
    'text_with_image' => [
        'type' => 'text_with_image',
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
                'remove_script_host' => false
            ]
        ]
    ]
];

return require 'recursive.php';
