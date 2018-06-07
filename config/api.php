<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Show modal to upload a generated email to an api
    |--------------------------------------------------------------------------
    |
    */

    'upload_modal' => true,

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
            'url' => '/rest/api/v1.1/auth/token',
            'config' => [
                'base_uri' => env('API_RESPONSYS_BASE_URI', '')
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
        'token_endpoint' => 'https://api2.ibmmarketingcloud.com/oauth/token',
        'endpoint' => 'https://api2.ibmmarketingcloud.com/XMLAPI',
        'client_id' => env('API_SILVERPOP_USERNAME', ''),
        'client_secret' => env('API_SILVERPOP_PASSWORD', ''),
        'app_name' => env('API_SILVERPOP_APP_NAME', ''),
        'refresh_token' => env('API_SILVERPOP_REFRESH_TOKEN', ''),
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

    /*
    |--------------------------------------------------------------------------
    | Scraper
    |--------------------------------------------------------------------------
    |
    | This place contains all the data related to the web scraper.
    |
    */

    'scraper' => [

        /*
        | Turn on/off the scraper
        */
        'status' => true,

        /*
        | Scraper settings
        */
        'settings' => [
            /*
            | Turn on/off the daily command that run all the scrapers
            */
            'daily_preload' => false,

            /*
            | At what time the scraper preload should run each day if it is enable
            */
            'daily_preload_at' => '08:00',

            /*
            | Turn on/off the preload scraper on user's login
            */
            'login_preload' => false,

            /*
            | Turn on/off the preload scraper when a campaign is created or accesed
            */
            'campaign_preload' => false,
        ],

        /*
        | Scraper sources. Group by libraries.
        */
        'sources' => [
            'libraries' => [
                'default' => [
                    // just for testing
                    "instagram" => [
                        'user_name' => 'disneystyle',
                    ],
                    // just for testing
                    "blog" => [
                        'url' => 'https://style.disney.com',
                        'process_type' => 'meta',
                        'name' => 'style',
                        'pagination_link' => 'https://style.disney.com/page/%s/',
                        'pagination_count' => 1,
                        'link_container_id' => 'tm-content',
                        'link_class' => 'tm-article-title-text',
                        'full_image_src' => 'og:image',
                        'text_src' => 'twitter:title',
                        'created_time' => 'article:published_time',
                        'link_src' => 'og:url',
                        'subtext_src' => 'twitter:description'
                    ],
                    'marketingCloud' => [
                        'name' => 'scraper-marketing-cloud'
                    ]
                ]
            ]
        ]
    ],

    'marketo' => [
        'title' => 'Marketo',
        'class' => 'Marketo',
        'api_path' => env('API_MARKETO_ENDPOINT', ''),
        'credentials' => [
            'client_id' => env('API_MARKETO_CLIENT_ID', ''),
            'client_secret' => env('API_MARKETO_CLIENT_SECRET', ''),
            'api_key' => env('API_MARKETO_API_KEY', '')
        ],
        'auth' => [
            'type' => 'GET',
            'url' => '/identity/oauth/token',
            'credentials' => [
                'grant_type' => 'client_credentials',
                'client_id' => env('API_MARKETO_CLIENT_ID', ''),
                'client_secret' => env('API_MARKETO_CLIENT_SECRET', '')
            ]
        ],
        'upload_email' => [
            'type' => 'POST',
            'url' => '/rest/asset/v1/emailTemplates.json'
        ],
        'folder' => [
            'type' => 'GET',
            'url' => '/rest/asset/v1/folder/%s.json',
            'id' => env('API_MARKETO_FOLDER_ID', ''),
            'params' => [
                'type' => 'Folder'
            ]
        ],
        'folder_by_name' => [
            'type' => 'GET',
            'url' => '/rest/asset/v1/folder/byName.json',
            'params' => [
                'name' => env('API_MARKETO_FOLDER_NAME', ''),
                'type' => 'Folder'
            ]
        ],
        'list_folders' => [
            'type' => 'GET',
            'url' => '/rest/asset/v1/folders.json'
        ]
    ]
];
