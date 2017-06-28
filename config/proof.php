<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Proof settings
    |--------------------------------------------------------------------------
    */

    // Turn on/off proof functionality
    'status' => true,

    // All required reviewers are necessary
    'required_reviews' => true,

    // Email settings
    'email' => [
        'from_name' => 'Review Request from stensul',
        'from_email' => env('MAIL_FROM_ADDRESS', 'review@stensul.com')
    ]

];

return require 'recursive.php';
