<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image supports "GD Library" and "Imagick" to process images
    | internally. You may choose one of them according to your PHP
    | configuration. By default PHP's "GD Library" implementation is used.
    |
    | Supported: "gd", "imagick"
    |
    */

    'driver' => 'imagick',

    /*
    |--------------------------------------------------------------------------
    | Force JPG conversion on image creator
    |--------------------------------------------------------------------------
    |
    */

    'force_conversion_jpg' => false,

    /*
    |--------------------------------------------------------------------------
    | Convert command path to use custom command line scripts
    |--------------------------------------------------------------------------
    |
    */
    'convert_base_path' => env('CONVERT_COMMAND_PATH', '/usr/local/bin/convert')
];