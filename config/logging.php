<?php
return [
    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that gets used when writing
    | messages to the logs. The name specified in this option should match
    | one of the channels defined in the "channels" configuration array.
    |
    */
    'default' => env('LOG_CHANNEL', 'daily'),
    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Out of
    | the box, Laravel uses the Monolog PHP logging library. This gives
    | you a variety of powerful log handlers / formatters to utilize.
    |
    | Available Drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "custom", "stack"
    |
    */
    'channels' => [

        // production conf begins
        'production' => [
            'driver'  => 'custom',
            'via' => Stensul\Logging\Bootstrap\ProductionLogger::class,
            'path' => storage_path('logs/laravel.log'),
            'level' => env('APP_LOG_LEVEL', 'debug'),
        ],
        // production conf ends
        
        'stack' => [
            'driver' => 'stack',
            'channels' => ['daily'],
        ],
        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('APP_LOG_LEVEL', 'debug'),
        ],
        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('APP_LOG_LEVEL', 'debug'),
            'days' => 0,
        ],
        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => 'Laravel Log',
            'emoji' => ':boom:',
            'level' => env('APP_LOG_LEVEL', 'critical'),
        ],
        'syslog' => [
            'driver' => 'syslog',
            'level' => env('APP_LOG_LEVEL', 'debug'),
        ],
        'errorlog' => [
            'driver' => 'errorlog',
            'level' => env('APP_LOG_LEVEL', 'debug'),
        ],
    ],
];
