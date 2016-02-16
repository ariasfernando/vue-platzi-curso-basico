<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Process Plain Text
    |--------------------------------------------------------------------------
    |
    | Active the plain text generator when the campaign were processed
    |
    */

    'process_plaintext' => true,

];

return require 'recursive.php';
