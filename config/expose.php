<?php
return [
    'admin' => '*',
    'global_settings' => '*',
    'campaign' => '*',
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
            'title', 'class', 'email_folder_name', 'subject_input', 'libraries'
        ],
        'silverpop' => [
            'title', 'class'
        ],
    ],
];
