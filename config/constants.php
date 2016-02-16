<?php

/*
|--------------------------------------------------------------------------
| Application Constants
|--------------------------------------------------------------------------
|
| Configuration file for the application constants to configuration.
|
*/

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    'DEFAULT_CAMPAIGN_NAME' => 'Untitled Campaign',
    'DEFAULT_LOCALE' => 'en_us',

];

return require 'recursive.php';
