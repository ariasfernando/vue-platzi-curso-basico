<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cdn Providers
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default cdn that should be used by the framework.
    |
    */

    'default' => 'akamai',

    'host' => env('CDN_HOST', ''),

    'providers' => [

        'maxcdn' => [
            'adapter'    => 'MaxCdnAdapter',
            'alias'      =>  env('CDN_MAXCDN_ALIAS', ''),
            'key'        =>  env('CDN_MAXCDN_KEY', ''),
            'secret'     =>  env('CDN_MAXCDN_SECRET', ''),
            'path'       =>  env('CDN_MAXCDN_PATH', ''),
        ],
        'akamai' => [
            'adapter'       => 'AkamaiAdapter',
            'base_uri'      => env('CDN_AKAMAI_BASE_URI'),
            'client_token'  => env('CDN_AKAMAI_CLIENT_TOKEN'),
            'client_secret' => env('CDN_AKAMAI_CLIENT_SECRET'),
            'access_token'  => env('CDN_AKAMAI_ACCESS_TOKEN'),
            'path'          => env('CDN_AKAMAI_PATH')
        ]

    ],

];
