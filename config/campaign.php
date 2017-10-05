<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Process Plain Text
    |--------------------------------------------------------------------------
    |
    | Enable the plain text generator when the campaign is processed
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
    | Enable favorite template feature
     */

    'enable_favorite_template' => true,

    'favorite_settings' => [
        /*
         | Type of favorite templates (global - user)
         */
        'type' => 'user',
    ],

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
    'locking' => true,
    'locking_templates' => true,

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
    |--------------------------------------------------------------------------
    | Show/hide Created By campaign field in Dashboard - global Config
    |--------------------------------------------------------------------------
     */
    'created_by_dashboard' => true,

    /*
    |---------------------------------------------------------------------------
    | Library level Configuration
    |---------------------------------------------------------------------------
     */
    'libraries' => [
        'default' => [
            'locking' => true,
            'locking_templates' => true
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
        'show_preheader' => true,

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
    | Enable validate url exists - global Config
    |--------------------------------------------------------------------------
     */
    'validate_url_exists' => true,

    'validate_url_settings' => [

        /*
         | List the selectors classes where the url validation should be done.
         */
        'selector_class' => ['image-destination-url', 'url-format']
    ],

    /*
    |--------------------------------------------------------------------------
    | Current user email who is editing the email
    |--------------------------------------------------------------------------
    |
    | Show the email address who is editing the campaign in the warning message
    |
    */

    'show_who_is_locking' => true,
];
