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
        'title' => "Button editor"
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
     ]
];

return include('recursive.php');
