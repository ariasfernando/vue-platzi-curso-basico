<?php

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Process Plain Text
    |--------------------------------------------------------------------------
    |
    | Active the plain text generator when the campaign were processed
    |
    */

    'process_plaintext' => true,

    /*
    |--------------------------------------------------------------------------
    | Enable tagging feature
    |--------------------------------------------------------------------------
     */

    'enable_tagging' => true,

    /*
    |--------------------------------------------------------------------------
    | Enable templating feature
     */

    'enable_templating' => true,

    /*
    |--------------------------------------------------------------------------
    | Search feature
    |--------------------------------------------------------------------------
     */

    'enable_search' => true,

    'search_settings' => [
        /*
         | Set the maximum of tags that the user could use in a search.
         | Set 0 for no limit.
         */
        'max_tags' => 0,

        /*
         | Turn on/off the highlighted results by search terms.
         */
        'highlight_matches' => true,

        /*
         | List the fields where the search should be done.
         */
        'fields_to_search' => ['campaign_name', 'user_email']
    ],

    /*
    |--------------------------------------------------------------------------
    | View in browser
    |--------------------------------------------------------------------------
    |
    | Show/hide view in browser link.
    | This could be overridden in each library's setting.
    |
    */

    'view_in_browser' => true,
    /*
    |--------------------------------------------------------------------------
    | Enable Locking camapaign - global Config
    |--------------------------------------------------------------------------
     */
    'locking' => false,

    /*
    |---------------------------------------------------------------------------
    | Library level Configuration
    |---------------------------------------------------------------------------
     */
    'libraries' => [
        'default' => [
            'locking' => true
        ]
    ]

];

return require 'recursive.php';
