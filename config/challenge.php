<?php

return [

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