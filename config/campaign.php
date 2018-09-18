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
    | Tracking feature
    |--------------------------------------------------------------------------
     */

    'enable_tracking' => false,

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
        'fields_to_search' => ['campaign_name', 'created_by.email', 'updated_by.email', 'library_name'],

        /*
         | Show popular tags in the beginning of autocomplete.
         */
        'show_popular_tags' => true,

        /*
         | How many popular tags should be listed.
         */
        'number_of_popular_tags' => 5,
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
    | Clean empty tag without link - will be replaced with span tag
    |--------------------------------------------------------------------------
     */
    'clean_empty_links' => false,

    /*
    | Ignore domains from image url changes into cdn
    |--------------------------------------------------------------------------
    |
    | Include here an array of domains that should be ignored from the
    | process of turn image url into cdn url.
    |
    */

    'ignored_image_domains' => [],

    'enable_html_minify' => true,

];
