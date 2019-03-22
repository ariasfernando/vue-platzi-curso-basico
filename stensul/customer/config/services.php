<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */
    
    'okta' => [
        'client_id'     => env('OAUTH_OKTA_KEY'),
        'client_secret' => env('OAUTH_OKTA_SECRET'),
        'redirect'      => env('OAUTH_OKTA_REDIRECT_URI'),
        'auth_url'      => env('OAUTH_OKTA_AUTH_URL'),
        'token_url'     => env('OAUTH_OKTA_TOKEN_URL'),
        'user_url'      => env('OAUTH_OKTA_USER_URL')
    ],
];
