<?php

/*
|--------------------------------------------------------------------------
| Application Locale
|--------------------------------------------------------------------------
|
| Configuration file for the application locales to create campaigns.
|
*/

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Global Locale Default
    |--------------------------------------------------------------------------
    */
    'locale_default' => 'en_us',

    /*
    |--------------------------------------------------------------------------
    | Base Trasnlations paths for global and modules path
    |--------------------------------------------------------------------------
    */
    'base_translation_path' => base_path() . '/resources/lang/',

    /*
    |--------------------------------------------------------------------------
    | List of Languages default
    |--------------------------------------------------------------------------
    */
    'langs' => [
        'en_aunz' => [
            'name' => 'AUNZ',
            'direction' => 'ltr',
        ],
        'pt_br' => [
            'name' => 'Brazil',
            'direction' => 'ltr',
        ],
        'en_uk' => [
            'name' => 'UK',
            'direction' => 'ltr',
        ],
        'en_us' => [
            'name' => 'US',
            'direction' => 'ltr',
        ]
    ]
];

return require 'recursive.php';
