<?php

$overrideFile = str_replace('config/' . basename(__FILE__),  'stensul/customer/config/' . basename(__FILE__), __FILE__);

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
