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
        'eloqua' => [
            'title', 'class', 'email_folder_name', 'subject_input', 'libraries', 'use_oauth'
        ],
        'silverpop' => [
            'title', 'class'
        ],
        'epsilon' => [
            'title', 'class'
        ],
        'responsys' => [
            'title', 'class'
        ],
    ],
    'esp' => [
        'eloqua' => [
            'title', 'class', 'email_folder_name', 'subject_input', 'libraries', 'use_oauth'
        ],
        'silverpop' => [
            'title', 'class'
        ],
        'epsilon' => [
            'title', 'class'
        ],
        'responsys' => [
            'title', 'class'
        ],
    ],
];
