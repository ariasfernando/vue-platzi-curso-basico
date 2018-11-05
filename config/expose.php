<?php
return [
    'admin' => '*',
    'global_settings' => '*',
    'campaign' => '*',
    'tracking' => '*',
    'locale' => '*',
    'menu' => '*',
    'modals' => '*',
    'modules' => '*',
    'proof' => '*',
    'view' => '*',
    'api' => [
        'azure' => [
            'title', 'class'
        ],
        'eloqua' => [
            'title', 'class', 'email_folder_name', 'subject_input', 'libraries', 'use_oauth'
        ],
        'silverpop' => [
            'title', 'class'
        ],
        'responsys' => [
            'title', 'class'
        ],
    ],
];
