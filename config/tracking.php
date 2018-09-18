<?php
return [

    /*
     | Global Tracking
    */
    'default' => [
        'utm_source' => [
            'label' => 'UTM Source',
            'name' => 'utm_source',
            'input_type' => 'select',
            'options' => ['new_features', 'promos', 'feedback', 'other'],
            'values' => ''
        ],
        'utm_content' => [
            'label' => 'UTM Content',
            'name' => 'utm_content',
            'input_type' => 'text',
            'values' => ''
        ],
        'utm_campaign' => [
            'label' => 'UTM Campaign',
            'name' => 'utm_campaign',
            'input_type' => 'text',
            'values' => ''
        ],
        'utm_medium' => [
            'label' => 'UTM Medium',
            'name' => 'utm_medium',
            'input_type' => 'hidden',
            'values' => 'email_crm'
        ],
        'utm_term' => [
            'label' => 'UTM Term',
            'name' => 'utm_term',
            'input_type' => 'hidden',
            'values' => '[GAMMA_CODE]',
        ]
    ]
];
