<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
	|--------------------------------------------------------------------------
	| Third Party Services
	|--------------------------------------------------------------------------
	|
	| This file is for storing the credentials for third party services such
	| as Stripe, Mailgun, Mandrill, and others. This file provides a sane
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
        'key' => '',
        'secret' => '',
        'region' => 'us-east-1',
    ],

    'stripe' => [
        'model'  => 'Stensul\User',
        'key' => '',
        'secret' => '',
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
];

return require 'recursive.php';
