<?php
return [
    'enabled'             => true,
    'url'                 => 'https://help.stensul.com',
    'jwt'                 => true,
    'organization'        => 'base',
    'supported_role_name' => 'supported',
    'sections'            => [
        'help'    => [
            'text'     => 'Help',
            'url' => 'https://help.stensul.com'
        ],
        'glossary' => [
            'text'     => 'Module Glossary',
            'url' => '#' // override this in each tool.
        ],
        'submit_ticket' => [
            'text'     => 'Submit Ticket',
            'url' => [
                'supported'     => 'https://help.stensul.com/hc/en-us/requests/new',
                'non_supported' => '#'
            ]
        ]
    ]
];
