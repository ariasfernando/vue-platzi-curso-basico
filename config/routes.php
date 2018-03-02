<?php

/**
 * Routes configurations
 */
$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

/*
| Default Routes
*/
$default = [
    'resources' => [],
    'web' => [
        'get' => [
            '/'                                      => 'DashboardController@index',
            '/campaign/edit/{campaign_id?}'          => 'CampaignController@getEdit',
            '/campaign/data/{campaign_id?}'          => 'CampaignController@getData',
            '/campaign/plain-text'                   => 'CampaignController@getPlainText',
            '/campaign/html'                         => 'CampaignController@getHtml',
            '/campaign/download-html/{campaign_id}'  => 'CampaignController@getDownloadHtml',
            '/campaign/public-path/{campaign_id?}'   => 'CampaignController@getPublicPath',
            '/campaign/menu-items/{library_id}'      => 'CampaignController@getMenuItems',
            '/template/module'                       => 'TemplateController@getModule',
            '/template/library/{library}'            => 'TemplateController@getLibrary',
            '/template/campaign-edited-rows'         => 'TemplateController@getCampaignEditedRows',
            '/template/campaign-processed-rows'      => 'TemplateController@getCampaignProcessedRows',
            '/template/email-preview/{campaign_id?}' => 'TemplateController@getEmailPreview',
            '/queue/status/{process}/{job_id}'       => 'QueueController@getStatus',
            '/dashboard'                             => 'DashboardController@index',
            '/dashboard/campaigns/{type}'            => 'DashboardController@getCampaigns',
            '/dashboard/templates/{type}'            => 'DashboardController@getTemplates',
            '/dashboard/libraries'                   => 'DashboardController@getLibraries',
            '/dashboard/tags'                        => 'DashboardController@getTags',
            '/dashboard/menu'                        => 'DashboardController@getMenu',
            '/public/view/{id}'                      => 'PublicController@view',
            '/public/html/{id}'                      => 'PublicController@html',
            '/public/get/{id}'                       => 'PublicController@getCampaign',
            '/error'                                 => 'PublicController@error',
            '/config/{key}'                          => 'ConfigController@getGet',
            '/proof/campaign/{id}'                   => 'ProofController@getCampaign',
            '/proof/review/{token}'                  => 'ProofController@getReview',
            '/proof/data/{token}'                    => 'ProofController@getData',
            '/proof/comments/{token}'                => 'ProofController@getComments',
            '/proof/reviewers/{id}'                  => 'ProofController@getReviewers',
            '/proof/users'                           => 'ProofController@getUsers',
        ],

        'post' => [
            '/campaign/delete'             => 'CampaignController@postDelete',
            '/campaign/save'               => 'CampaignController@postSave',
            '/campaign/clone'              => 'CampaignController@postClone',
            '/campaign/process'            => 'CampaignController@postProcess',
            '/campaign/upload-image'       => 'CampaignController@postUploadImage',
            '/campaign/resize-image'       => 'CampaignController@postResizeImage',
            '/campaign/send-preview'       => 'CampaignController@postSendPreview',
            '/campaign/lock'               => 'CampaignController@postLock',
            '/campaign/force-lock'         => 'CampaignController@postForceLock',
            '/campaign/unlock-forced'      => 'CampaignController@postUnlockForced',
            '/campaign/og-image'           => 'CampaignController@postOgImage',
            '/campaign/gif-layer'          => 'CampaignController@postGifLayer',
            '/campaign/email-sent-history' => 'CampaignController@postEmailSentHistory',
            '/campaign/favorite'           => 'CampaignController@postFavorite',
            '/template/move-library'       => 'TemplateController@postMoveLibrary',
            '/template/modal'              => 'TemplateController@postModal',
            '/proof/comment/{token}'       => 'ProofController@postComment',
            '/proof/decision/{token}'      => 'ProofController@postDecision',
            '/proof/create'                => 'ProofController@postCreate',
        ],

        'put' => [],

        'delete' => [
            '/proof/decision/{token}'              => 'ProofController@deleteDecision',
        ],
    ],
    'api' => [
        'get'    => [
            '/api/history' => 'ApiController@getHistory'
        ],
        'post'   => [
            '/api/upload-email' => 'ApiController@postUploadEmail',
            '/api/validate-url' => 'ApiController@postValidateUrl'
        ],
        'put'    => [],
        'delete' => [],
    ],
    'excludedCsrf' => [
        'auth/login',
        'auth/session'
    ],

];
/*
| Simple Authentication Routes
*/
$defaultAuth = [
    'get' => [
        '/auth/login'    => 'Auth\BaseLoginController@getLogin',
        '/auth/logout'   => 'Auth\BaseLoginController@getLogout',
        '/auth/register' => 'Auth\BaseRegisterController@getRegister',

    ],
    'post' => [
        '/auth/login'    => 'Auth\BaseLoginController@postLogin',
        '/auth/register' => 'Auth\BaseRegisterController@postRegister',
    ],
];
/*
| OAuth Authentication Routes
*/
$oauthAuth = [
    'get' => [
        '/auth/login'       => 'Auth\OauthAuthController@getLogin',
        '/auth/oauth-login' => 'Auth\OauthAuthController@getOauthLogin',
        '/auth/session'     => 'Auth\OauthAuthController@getSession',
        '/auth/logout'      => 'Auth\OauthAuthController@getLogout',
        '/auth/register'    => 'Auth\BaseRegisterController@getRegister',
    ],
    'post' => [
        '/auth/register' => 'Auth\BaseRegisterController@postRegister',
    ],
];
if (env('USER_LOGIN', 'default') === 'oauth') {
    $default['web']['get'] = array_merge($oauthAuth['get'], $default['web']['get']);
    $default['web']['post'] = array_merge($oauthAuth['post'], $default['web']['post']);
} else {
    $default['web']['get'] = array_merge($defaultAuth['get'], $default['web']['get']);
    $default['web']['post'] = array_merge($defaultAuth['post'], $default['web']['post']);
}

if (env("APP_ADMIN", false)) {
    /*
    | Admin Routes
    */
    $adminRoutes = [
        'get' => [
            '/admin'                   => 'Admin\Auth\AdminAuthController@index',
            '/admin/login'             => 'Admin\Auth\AdminAuthController@getLogin',
            '/admin/logout'            => 'Admin\Auth\AdminAuthController@getLogout',
            '/admin/user'              => 'Admin\UserController@getIndex',
            '/admin/user/list'         => 'Admin\UserController@getList',
            '/admin/user/create'       => 'Admin\UserController@getCreate',
            '/admin/user/edit'         => 'Admin\UserController@getEdit',
            '/admin/role'              => 'Admin\RoleController@getIndex',
            '/admin/role/list'         => 'Admin\RoleController@getList',
            '/admin/role/create'       => 'Admin\RoleController@getCreate',
            '/admin/role/edit'         => 'Admin\RoleController@getEdit',
            '/admin/permission'        => 'Admin\PermissionController@getIndex',
            '/admin/permission/list'   => 'Admin\PermissionController@getList',
            '/admin/permission/create' => 'Admin\PermissionController@getCreate',
            '/admin/permission/edit'   => 'Admin\PermissionController@getEdit',
            '/admin/log'               => 'Admin\LogController@getIndex',
            '/admin/log/list'          => 'Admin\LogController@getList',
            '/admin/library'           => 'Admin\LibraryController@getIndex',
            '/admin/library/list'      => 'Admin\LibraryController@getList',
            '/admin/library/create'    => 'Admin\LibraryController@getCreate',
            '/admin/library/edit'      => 'Admin\LibraryController@getEdit',
            '/admin/module'            => 'Admin\ModuleController@getIndex',
            '/admin/module/list'       => 'Admin\ModuleController@getList',
            '/admin/module/create'     => 'Admin\ModuleController@getCreate',
            '/admin/module/edit'       => 'Admin\ModuleController@getEdit',
            '/admin/module/modules'    => 'Admin\ModuleController@getModules',
            '/admin/setting'           => 'Admin\SettingController@getIndex',
        ],
        'post' => [
            '/admin/login'                 => 'Admin\Auth\AdminAuthController@postLogin',
            '/admin/user/edit'             => 'Admin\UserController@postEdit',
            '/admin/user/create'           => 'Admin\UserController@postcreate',
            '/admin/user/delete'           => 'Admin\UserController@postDelete',
            '/admin/role/edit'             => 'Admin\RoleController@postEdit',
            '/admin/role/create'           => 'Admin\RoleController@postCreate',
            '/admin/role/delete'           => 'Admin\RoleController@postDelete',
            '/admin/permission/edit'       => 'Admin\PermissionController@postEdit',
            '/admin/permission/create'     => 'Admin\PermissionController@postCreate',
            '/admin/permission/delete'     => 'Admin\PermissionController@postDelete',
            '/admin/library/edit'          => 'Admin\LibraryController@postEdit',
            '/admin/library/create'        => 'Admin\LibraryController@postCreate',
            '/admin/library/delete'        => 'Admin\LibraryController@postDelete',
            '/admin/library/list'          => 'Admin\LibraryController@postList',
            '/admin/library/esp'           => 'Admin\LibraryController@postEspProviders',
            '/admin/module/save'           => 'Admin\ModuleController@postSave',
            '/admin/module/delete'         => 'Admin\ModuleController@postDelete',
            '/admin/module/upload-image'   => 'Admin\ModuleController@postUploadImage',
            '/admin/setting/edit'          => 'Admin\SettingController@postEdit',
        ],
    ];
    $default['web']['get'] = array_merge($adminRoutes['get'], $default['web']['get']);
    $default['web']['post'] = array_merge($adminRoutes['post'], $default['web']['post']);
}


if (env('USER_LOGIN', 'default') != "oauth") {
    $passwordRoutes = [
        'get'    => [
            '/password/email'          => 'Auth\PasswordController@getEmail',
            '/password/reset/{token}'  => 'Auth\PasswordController@getReset',
            '/password/change'         => 'Auth\PasswordController@getChange',
        ],
        'post'   => [
            '/password/email'  => 'Auth\PasswordController@postEmail',
            '/password/reset'  => 'Auth\PasswordController@postReset',
            '/password/change' => 'Auth\PasswordController@postChange',
        ],
    ];
    $default['web']['get'] = array_merge($passwordRoutes['get'], $default['web']['get']);
    $default['web']['post'] = array_merge($passwordRoutes['post'], $default['web']['post']);
}

return require 'recursive.php';
