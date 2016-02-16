<?php

/*
 | ===========================
 | Master Image editor configs
 | ===========================
 */

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

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
     ]
];

return include('recursive.php');
