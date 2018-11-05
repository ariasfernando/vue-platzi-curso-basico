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

    'mailgun' => [
        'domain' => env('MAIL_DOMAIN'),
        'secret' => env('MAIL_SECRET'),
    ],

    'mandrill' => [
        'secret' => '',
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model'  => 'Stensul\User',
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'google' => [
        'client_id'     => env('OAUTH_GOOGLE_KEY'),
        'client_secret' => env('OAUTH_GOOGLE_SECRET'),
        'redirect'      => env('OAUTH_GOOGLE_REDIRECT_URI'),
    ],

    'facebook' => [
        'client_id'     => env('OAUTH_FACEBOOK_KEY'),
        'client_secret' => env('OAUTH_FACEBOOK_SECRET'),
        'redirect'      => env('OAUTH_FACEBOOK_REDIRECT_URI'),
    ],
    'zendesk' => [
        'shared_key'   => env('ZENDESK_SHARED_KEY'),
        'login_url'    => env('ZENDESK_LOGIN_URL'),
        'organization' => env('ZENDESK_ORGANIZATION')
    ],
    'html_to_pdf' => [
        'api_key' => env('HTMLPDF_API_KEY'),
        'api_url' => env('HTMLPDF_API_URL')
    ],
];
