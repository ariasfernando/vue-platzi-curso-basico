<?php

return [

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
        ],       
        'folder_by_role' => [
            'cly-stentul-emails' => 22983,
            'cly-stentul-emails-japan' => 23114,
            'cly-stentul-emails-partners' => 23113,
            'cly-stentul-emails-row' => 23112,            
        ],
        'folder_by_permission' => [
            'access-marketo-folder-emails' => [
                'folder_name' => 'Stensul Emails',
                'folder_id' => 22983,
            ],
            'access-marketo-folder-emails-japan' => [
                'folder_name' => 'Stensul Emails - Japan',
                'folder_id' => 23114,
            ],
            'access-marketo-folder-emails-partners' => [
                'folder_name' => 'Stensul Emails - Partners',
                'folder_id' => 23113,
            ],
            'access-marketo-folder-emails-row' => [
                'folder_name' => 'Stensul Emails - ROW',
                'folder_id' => 23112,
            ]           
        ]
    ],
];
