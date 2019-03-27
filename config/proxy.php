<?php
$overrideFile = (env('APP_NAME', false))
? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
: false;

/**
 * ProxyController whitelist, only URL's matching exactly what's on this config will be proxied.
 */
$default = [
    'whitelist' => [
        // [
        //     'url' => 'https://stensul.com',
        //     'ttl' => 20, // minutes
        // ],
    ]
];

return require 'recursive.php';
