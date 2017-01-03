<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Show modal to upload a generated email to an api
    |--------------------------------------------------------------------------
    |
    */

    'upload_modal' => false,

    /*
    |--------------------------------------------------------------------------
    | Default Api Driver
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the api connections below you wish
    | to use.
    |
    */

    'api_driver' => 'eloqua',

    /*
    |--------------------------------------------------------------------------
    | Api data
    |--------------------------------------------------------------------------
    |
    | This place contains all the data related to external API.
    | Example call: Api::driver('eloqua'); $api->uploadEmail($campaign);
    |
    */

    'responsys' => [
        'title' => 'Responsys',
        'class' => 'Responsys',
        'default_path' => '/contentlibrary/' . env('API_RESPONSYS_PATH', ''),
        'auth' => [
            'type' => 'POST',
            'url' => '/rest/api/v1/auth/token',
            'config' => [
                'base_uri' => 'https://login2.responsys.net'
            ],
            'options' => [
                'form_params' => [
                    'user_name'  =>  env('API_RESPONSYS_USERNAME', ''),
                    'password'   =>  env('API_RESPONSYS_PASSWORD', ''),
                    'auth_type'  =>  'password'
                ]
            ]
        ],
        'create_folder' => [
            'type' => 'POST',
            'url' => '/rest/api/v1/clFolders'
        ],
        'list_folders' => [
            'type' => 'GET',
            'url' => '/rest/api/v1/clFolders'
        ],
        'create_doc' => [
            'type' => 'POST',
            'url' => '/rest/api/v1/clDocs'
        ]
    ],

    'eloqua' => [
        'title' => 'Eloqua',
        'class' => 'Eloqua',
        'email_folder_name' =>  env('API_ELOQUA_FOLDER', ''),
        'auth' => [
            'base_url' => 'https://login.eloqua.com',
            'type' => 'POST',
            'path' => '/auth/oauth2/token',
            'credentials' => [
                'client_id'  =>  env('API_ELOQUA_CLIENT_ID', ''),
                'client_secret'  =>  env('API_ELOQUA_CLIENT_SECRET', ''),
                'company_name'  =>  env('API_ELOQUA_COMPANY_NAME', ''),
                'user_name'  =>  env('API_ELOQUA_USER_NAME', ''),
                'password'   =>  env('API_ELOQUA_PASSWORD', ''),
            ]
        ],
        'user_credentials' => [
            'type' => 'GET',
            'url' => '/id'
        ],
        'list_folders' => [
            'type' => 'GET',
            'url' => 'assets/email/folders'
        ],
        'create_folder' => [
            'type' => 'POST',
            'url' => 'assets/email/folder'
        ],
        'upload_email' => [
            'type' => 'POST',
            'url' => 'assets/email'
        ],
    ],

    'exact_target' => [
        'title' => 'Exact Target',
        'class' => 'ExactTarget',
        'folder_id' => 'default',
        'base_url' => 'https://www.exacttargetapis.com/',
        'credentials' => [
            'authPath' => 'https://auth.exacttargetapis.com/v1/requestToken',
            'appsignature' => 'none',
            'clientid' => env('API_EXACT_TARGET_CLIENT_ID', ''),
            'clientsecret' => env('API_EXACT_TARGET_CLIENT_SECRET', ''),
            'defaultwsdl' => 'https://webservice.exacttarget.com/etframework.wsdl',
            'xmlloc' => app_path().'/Services/Api/ExactTargetConnection/ExactTargetWSDL.xml',
        ]
    ],

    'silverpop' => [
        'title' => 'Silverpop',
        'class' => 'Silverpop',
        'api_path' => 'http://api.pilot.silverpop.com/XMLAPI',
        'user_name' => env('API_SILVERPOP_USERNAME', ''),
        'password' => env('API_SILVERPOP_PASSWORD', ''),
        'folder_path' => ''
    ],

    'yesmail' => [
        'title' => 'Yesmail',
        'class' => 'Yesmail',
        'base_url' => 'https://api.yesmail.com/v2/',
        'credentials' => [
            'company' => env('YESMAIL_COMPANY', ''),
            'user' => env('YESMAIL_USER', ''),
            'api_key' => env('YESMAIL_API_KEY', '')
        ],
        'upload_email' => [
            'type' => 'POST',
            'url' => 'content-blocks'
        ],
    ],

];

return include('recursive.php');
