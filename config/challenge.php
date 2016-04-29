<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Challenge Providers
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default challenge that should be used by the framework.
    |
    */

    'default' => 'recaptcha',

    'enabled' => true,

    'providers' => [

        'recaptcha' => [
            'cache_key'             => 'blacklist_ip_',
            'adapter'               => 'ReCaptchaAdapter',
            'max_failed_attemtps'   => '3',
            'max_timeout'           => '1', // in minutes
            'key'                   =>  env('RECAPTCHA_KEY', ''),
            'secret'                =>  env('RECAPTCHA_SECRET', ''),
        ],

    ],

];

return require 'recursive.php';