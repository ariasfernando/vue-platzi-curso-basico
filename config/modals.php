<?php

/*
 | ===========================
 | Master Image editor configs
 | ===========================
 */

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

/*
 | ===== Configs =====
 | You should use array_merge(arr1,arr2) if you want override some value
 */
$single_image_editor = [
    "app_name" => "base",
    "view" => "single_image_editor", // Blade template name
    "config_modal_key" => "single_image_editor", // Key for configModals script
    "title" => "Image editor",
    "enabled_options" => "destination_url alt_text image_upload og_image image_crop",
    "image_size" => [
        "height" => 250,
        "width" => 300
    ]
];

$default = [
    "single" => array_merge($single_image_editor, [
        "image_size" => [
            "height" => 240,
            "width" => 320
        ]
    ]),

    "single_shared_height" => array_merge($single_image_editor, [
        "image_size" => [
            "height" => 240,
            "width" => 320
        ],
        "enabled_options" => "destination_url alt_text image_upload adjustable_height image_crop"
    ]),

    "mie_v2_default_height_proportional" => array_merge($single_image_editor, [
        "image_size" => [
            "height" => 'auto',
            "width" => 526
        ],
        "title" => "Adjustable Width",
        "enabled_options" => "destination_url alt_text image_upload adjustable_width image_crop",
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ]
    ]),

    "mie_v2_default_adjustable_height" => array_merge($single_image_editor, [
        "image_size" => [
            "height" => 250,
            "width" => "auto"
        ],
        "title" => "Adjustable Height",
        "enabled_options" => "destination_url alt_text image_upload adjustable_height image_crop",
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ]
    ]),

    /* -- Hero Image: Full image editor -- */
    "hero" => [
        "title" => "Hero image editor",
        "image_library" => "enabled",
        "image_library_config" => [
            "folder" => "hero"
        ],
        "image_crop" => "enabled",
        "image_overlay" => "enabled",
        "image_overlay_config" => [
            "image_path" => "/images/default/image-placeholder-218x90.png",
            "image_alt" => "image_overlay",
            "image_height" => "90",
            "image_width" => "218"
        ],
        "text_overlay" => "enabled",
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "scale_ratio" => 2
    ],

    /* -- hero mobile: Full width image editor to mobile -- */
    'heroMobile' => [
        "title" => "Full width image",
        "image_library_config" => [
            "folder" => "hero"
        ],
        "image_library" => "enabled",
        "image_crop" => "enabled",
        "image_size_adjustable" => "enabled",
        "text_overlay" => "enabled",
        "multi_crop" => "enabled",
        "toolbox" => [
            "drag" => [
                "class" =>  "drag-text",
                "icon" => "resize-vertical"
            ]
        ],
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        'og_image' => "enabled",
        "scale_ratio" => 2
    ],

    /* -- Hero Image: Full image editor -- */
    'header' => [
        'title' => "Header image",
        'image_crop' => "enabled",
        'image_size' => [
            'height' => 98,
            'width' => 660
        ],
        "scale_ratio" => 2
    ],

    /* -- Ad Unit: Basic image editor --*/
    'basic' => [
        'title' => "Standard ad image editor",
        'image_size' => [
            'height' => 250,
            'width' => 300
        ]
    ],

    /* -- Media Content: Standard image editor -- */
    'standard' => [
        'title' => "Image editor",
        'image_crop' => "enabled",
        'og_image' => "enabled"
    ],

    /* -- Thin add -- */
    'thinAd' => [
        'title' => "Thin ad block image editor",
        'image_size' => [
            'height' => 50,
            'width' => 320
        ]
    ],

    /* -- Primary Button: default -- */
    'default_button' => [
        'title' => "Button editor",
        'line_limit' => 2
    ],

    'image_plus_text' => [
        "title" => "Image + text image editor",
        "image_crop" => "enabled",
        "image_size" => [
            "width" => 318,
            "height" => 153
        ]
    ],

    'auto_image' => [
        'title' => 'Auto image editor',
        "image_resize" => "enabled",
        'image_size' => [
            'width' => 660,
            'height' => 'auto'
        ]
    ],

    /* -- Custom table  -- */
    'custom_table' => [
        'targetTableSelector' => '.st-custom-table',
        'maxCols' => 4,
        'minCols' => 1,
        'maxRows' => 20,
        'minRows' => 2
    ],

     'two_columns' => [
        "title" => "Two columns image editor",
        "image_crop" => "enabled",
        "image_size" => [
            "width" => 240,
            "height" => 90
        ]
     ],
     "text_with_image" => [
        "title" => "Text with image",
        "image_crop" => "enabled",
        "image_size" => [
            "width" => 175,
            "height" => 131
        ],
        "adjustable_height" => "enabled",
        "adjustable_height_options" => [
            "max" => 300,
            "min" => 100
        ],
        "adjustable_width" => "enabled",
        "adjustable_width_options" => [
            "max" => 280,
            "min" => 100
        ]
     ],
    // == Master image editor v2 modals ==
     "mie_v2_default_no_crop" => [
        "title" => "Hero Image - no crop",
        "app_name" => "base",
        "view" => "single_image_editor",
        "config_modal_key" => "image_modal_no_crop",
        "enabled_options" => "destination_url alt_text image_upload",
        'image_crop' => "disabled",    // Rewrite old version param
        'image_overlay' => "disabled", // Rewrite old version param
        'text_overlay' => "disabled",  // Rewrite old version param
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ]
     ],
     "mie_v2_single_crop" => [
        "title" => "Hero Image - single crop",
        "app_name" => "base",
        "view" => "single_image_editor",
        "config_modal_key" => "image_modal_single_crop",
        "scale_ratio" => 2,
        "enabled_options" => "destination_url alt_text image_upload image_crop",
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ]
     ],
     "mie_v2_library" => [
        "title" => "Image Library",
        "app_name" => "base",
        "view" => "single_image_editor",
        "config_modal_key" => "image_modal_single_crop",
        "scale_ratio" => 2,
        "enabled_options" => "destination_url alt_text image_upload image_crop image_library",
        "enabled_plugins" => "imageLibrary",
        "library_folder" => "hero",
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ]
     ],
     "mie_v2_library_scraper_instagram" => [
        "title" => "Instagram Scraper",
        "app_name" => "base",
        "view" => "single_image_editor",
        "config_modal_key" => "image_modal_single_crop",
        "scale_ratio" => 2,
        "enabled_options" => "destination_url alt_text image_upload image_crop image_library",
        "enabled_plugins" => "imageLibraryScraper",
        "api_type" => "instagram",
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ]
     ],
     "mie_v2_library_scraper_blog" => [
        "title" => "Blog Scraper",
        "app_name" => "base",
        "view" => "single_image_editor",
        "config_modal_key" => "image_modal_single_crop",
        "scale_ratio" => 2,
        "enabled_options" => "destination_url alt_text image_upload image_crop image_library",
        "enabled_plugins" => "imageLibraryScraper",
        "api_type" => "blog",
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ]
     ],
     "mie_v2_overlays" => [
        "title" => "Image with overlays",
        "app_name" => "base",
        "view" => "single_image_editor",
        "config_modal_key" => "image_modal_single_crop",
        "enabled_options" => "destination_url alt_text image_upload image_crop",
        "enabled_plugins" => "overlay",
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ],
        "overlays" => [
            [
                "type" => "image",
                "width" => "180",
                "id" => "stensul-logo",
                "class" => "stensul-logo",
                "control_id" => "image-overlay",
                "control_label" => "Display logo",
                "path" => "/images/stensul-logo-black.png",
                "save_as" => "logo_overlay",
                "reposition" => true,
            ],[
                "type" => "text",
                "save_as" => "text0",
                "id" => "overlay-text",
                "default" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
                "class" => "stensul-text",
                "control_id" => "text-overlay",
                "control_label" => "Display text",
                "reposition" => true
            ]
        ]
     ],
     "mie_v2_richtext" => [
        "title" => "Image with rich text overlay",
        "app_name" => "base",
        "view" => "single_image_editor",
        "config_modal_key" => "image_modal_single_crop",
        "enabled_options" => "destination_url alt_text image_upload image_crop",
        "enabled_plugins" => "overlay",
        "image_size" => [
            "height" => 400,
            "width" => 660
        ],
        "labels" => [
            "file_upload" => "Allowed file types: png, jpg and gif."
        ],
        "overlays" => [
            [
                "type" => "image",
                "width" => "180",
                "id" => "stensul-logo",
                "class" => "stensul-logo",
                "path" => "/images/stensul-logo-black.png",
                "control_id" => "image-overlay",
                "control_label" => "Display logo",
                "save_as" => "logo_overlay"
            ],[
                "type" => "rich_text",
                "save_as" => "text1",
                "control_id" => "text-overlay",
                "control_label" => "Display text",
                "id" => "overlay-rich-text",
                "default" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
                "class" => "stensul-rich-text",
                "reposition" => true,
                "options" => [
                    'formats' => [
                        'underline' => [
                            'inline' => 'u',
                            'exact' => true
                        ]
                    ],
                    'fixed_toolbar_container' => '.rich-text-container .rich-text-toolbox',
                    'toolbar' => 'bold italic underline forecolor',
                    'plugins' => 'paste advlist autolink lists textcolor',
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
                    'textcolor_rows' => 1,
                    'textcolor_map' => [
                        'FFFFFF', 'White',
                        '333333', 'Dark gray',
                        '595A5D', 'Gray',
                        'EC2127', 'Red',
                        'ECEDEE', 'lightGray'
                    ]
                ]
            ]
        ]
     ]
];

return include('recursive.php');
