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
         | Set if an alert message should be shown when the user reach the
         | maximum of search terms.
         */
        'max_tags_alert' => false,

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
    |--------------------------------------------------------------------------
    | Enable Download html
    |--------------------------------------------------------------------------
     */
    'download_html' => false,

    /*
    |--------------------------------------------------------------------------
    | Enable Locking camapaign - global Config
    |--------------------------------------------------------------------------
     */
    'confirm_delete_module' => false,

    /*
    |---------------------------------------------------------------------------
    | Library level Configuration
    |---------------------------------------------------------------------------
     */
    'libraries' => [
        'default' => [
            'locking' => true
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Send preview settings
    |--------------------------------------------------------------------------
    |
    | Active different settings inside the send preview modal
    |
    */

    'preview' => [

        /*
        | Show an input to edit the preview email subject
        */
        'edit_subject_line' => false,

        /*
        | Show an input to insert a preheader text to be sent in the preview email
        */
        'show_preheader' => false,

    ],

    /*
    |--------------------------------------------------------------------------
    | Auto save
    |--------------------------------------------------------------------------
     */
    'auto_save' => [
        'enabled' => false,
        'default_on' => false,
        'delay' => 5 // Seconds, time to wait after any change
    ],

    /*
    |--------------------------------------------------------------------------
    | Current user email who is editing the email
    |--------------------------------------------------------------------------
    |
    | Show the email address who is editing the campaign in the warning message
    |
    */

    'show_who_is_locking' => false,
];

return require 'recursive.php';
