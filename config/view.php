<?php

use Stensul\Providers\HelperServiceProvider as Helper;

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel view path has already been registered for you.
    |
    */

    'paths' => [
        realpath(base_path('resources/views')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compiled View Path
    |--------------------------------------------------------------------------
    |
    | This option determines where all the compiled Blade templates will be
    | stored for your application. Typically, this is within the storage
    | directory. However, as usual, you are free to change this value.
    |
    */

    'compiled' => realpath(storage_path('framework/views')),

    /*
    |--------------------------------------------------------------------------
    | Campaign format
    |--------------------------------------------------------------------------
    |
    | Specify the format of the campaign selectible by the menu on dashboard
    | It can be:
    | "languages" Use the languages list of the config locales to create the menu.
    | "libraries" Use the libraries list of the config view libraries and config auth
    | user permissions to create the menu.
    |
    */
    "campaign_format" => "libraries",

    /*
    |--------------------------------------------------------------------------
    | Preheader global config
    |--------------------------------------------------------------------------
    |
    |  If max_length exists, enables the recomendable length warning validation
    |
    */
    'preheader' => [
        'enabled'   => true,
        'max_length'=> 50
    ],


    /*
    |--------------------------------------------------------------------------
    | Default avatar
    |--------------------------------------------------------------------------
    |
    | This is the default avatar image.
    |
    */
    'default_avatar_path' => '/images/_common/default_avatar.jpg',

    /*
    |--------------------------------------------------------------------------
    | Preview
    |--------------------------------------------------------------------------
    */
    'preview' => true,

    /*
    |--------------------------------------------------------------------------
    | Suite Assets CDN host
    |--------------------------------------------------------------------------
    |
    | This is the suite assets CDN host.
    |
    */
    'suite_cdn_host' => env('SUITE_ASSETS_CDN_HOST', env('APP_BASE_URL')),

    /*
    |--------------------------------------------------------------------------
    | Libraries
    |--------------------------------------------------------------------------
    |
    | Define the default library settings
    |
    */

    'libraries' => [
        'default' => [
            "template_width" => "660",
            "template_mobile_width" => "320",
            "template_bg_color" => "#FFFFFF",
            "font_family_css" => "font-family:Arial, Helvetica, sans-serif;font-weight:normal",
            "font_family_semi_bold_css" => "font-family:Arial, Helvetica, sans-serif;font-weight:normal",
            "font_family_bold_css" => "font-family:Arial, Helvetica, sans-serif;font-weight:normal",
            "font_family_bold" => "Arial, Helvetica, sans-serif",
            "font_family" => "Arial, Helvetica, sans-serif",
            "building_mode_select" => true,
            "api_connection" => false,
            'preheader' => [
                'enabled'   => true,
                'max_length'=> 50
            ],
        ]
    ]
];

$array_extend = require 'recursive.php';

foreach ($array_extend["libraries"] as $key_style => $value_style) {
    if ($key_style !== 'default') {
        $array_extend["libraries"][$key_style] = Helper::arrayMergeRecursiveDistinct(
            $array_extend["libraries"]["default"],
            $array_extend["libraries"][$key_style]
        );
    }
}

return $array_extend;
