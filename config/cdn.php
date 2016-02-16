<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Cdn Providers
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default cdn that should be used by the framework.
    |
    */

    'default' => 'maxcdn',

    'host' => env('CDN_HOST', ''),

    'providers' => [

        'maxcdn' => [
            'adapter'    => 'MaxCdnAdapter',
            'alias'      =>  env('CDN_MAXCDN_ALIAS', ''),
            'key'        =>  env('CDN_MAXCDN_KEY', ''),
            'secret'     =>  env('CDN_MAXCDN_SECRET', ''),
            'path'       =>  env('CDN_MAXCDN_PATH', ''),
        ],

    ],

];

return require 'recursive.php';
