<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. A "local" driver, as well as a variety of cloud
    | based drivers are available for your choosing. Just store away!
    |
    | Supported: "local", "ftp", "s3", "rackspace"
    |
    */

    'default' => 'local',

    /*
    |--------------------------------------------------------------------------
    | Default Cloud Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Many applications store files both locally and in the cloud. For this
    | reason, you may specify a default "cloud" driver here. This driver
    | will be bound as the Cloud disk implementation in the container.
    |
    */

    'cloud' => 's3',

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    */

    'temp_dir' => storage_path() . '/app/tmp',

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path(),
        ],

        'local:campaigns' => [
            'driver' => 'local',
            'root' => public_path() . '/images/campaigns',
        ],

        'local:public' => [
            'driver' => 'local',
            'root'   => public_path()
        ],

        'local:libraries' => [
            'driver' => 'local',
            'root'   => public_path() . '/images/libraries/',
        ],

        'cloud' => [
            'driver' => 's3',
            'key'    => env('AWS_S3_KEY', ''),
            'secret' => env('AWS_S3_SECRET', ''),
            'region' => env('AWS_S3_REGION', ''),
            'bucket' => env('AWS_S3_BUCKET', ''),
        ]
    ],

];

return require 'recursive.php';
