<?php

return [

    /*
    |--------------------------------------------------------------------------
    | ESP Providers
    |--------------------------------------------------------------------------
    |
    | Here you may specify the ESP that should be used by the customer.
    |
    */

    'responsys' => [
        'title' => 'Responsys',
        'class' => 'Responsys',
        'default_path' => '/contentlibrary/' . env('API_RESPONSYS_PATH', ''),
        'auth' => [
            'type' => 'POST',
            'url' => '/rest/api/v1.1/auth/token',
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
            'url' => '/rest/api/v1.1/clFolders'
        ],
        'list_folders' => [
            'type' => 'GET',
            'url' => '/rest/api/v1.1/clFolders'
        ],
        'create_doc' => [
            'type' => 'POST',
            'url' => '/rest/api/v1.1/clDocs'
        ],
        'delete_doc' => [
            'type' => 'DELETE',
            'url' => '/rest/api/v1.1/clDocs'
        ],
        'libraries' => [],
        'overwrte_file' => false
    ],

    'eloqua' => [
        'title' => 'Eloqua',
        'class' => 'Eloqua',
        'email_folder_name' =>  env('API_ELOQUA_FOLDER', ''),
        'use_oauth' => false,
        'subject_input' =>  true,
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
        'oauth' => [
            'base_url' => 'https://login.eloqua.com',
            'type' => 'GET',
            'path' => '/auth/oauth2/authorize',
            'credentials' => [
                'response_type'  => 'code',
                'client_id'  => env('API_ELOQUA_CLIENT_ID', ''),
                'redirect_uri' => env('APP_BASE_URL').'/api/oauth',
                'scope' => 'full'
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
        'libraries' => []
    ],

    'exact_target' => [
        'title' => 'SFMC',
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
        ],
        'libraries' => [],
    ],

    'silverpop' => [
        'title' => 'Silverpop',
        'class' => 'Silverpop',
        'api_path' => 'http://api.pilot.silverpop.com/XMLAPI',
        'user_name' => env('API_SILVERPOP_USERNAME', ''),
        'password' => env('API_SILVERPOP_PASSWORD', ''),
        'folder_path' => '',
        'libraries' => []
    ],

    'strongview' => [
        'title' => 'Strongview',
        'class' => 'Strongview',
        'api_wsdl' => "/sm/services/mailing/v2?wsdl",
        'api_host' => env('API_STRONGVIEW_HOST', ''),
        'organization' => env('API_STRONGVIEW_ORGANIZATION', ''),
        'sub_organization' => env('API_STRONGVIEW_SUB_ORGANIZATION', 1),
        'user_name' => env('API_STRONGVIEW_USERNAME', ''),
        'password' => env('API_STRONGVIEW_PASSWORD', ''),
        'allow_self_signed_cert' => true,
        'libraries' => []
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
