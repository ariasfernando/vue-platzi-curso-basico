<?php

/*
|--------------------------------------------------------------------------
| Application Locales
|--------------------------------------------------------------------------
|
| Configuration file for the application locales to create campaigns.
|
*/

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [
    'en_us' => 'US',
    'en_ap' => 'APAC',
    'pt_br' => 'Brazil',
    'en_ca' => 'Canada',
    'fr_fr' => 'EMEA France',
    'de_de' => 'EMEA Germany',
    'it_it' => 'EMEA Italy',
    'es_es' => 'EMEA Spain',
    'en_uk' => 'EMEA UK',
    'es_la' => 'Spanish LATAM',
];

return require 'recursive.php';
