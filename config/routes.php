<?php

/**
 * Routes configurations
 */

$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    'controllers' => [
        'auth'    => ( env('USER_LOGIN', 'default') == "oauth" )
            ? 'Auth\OauthAuthController'
            : 'Auth\BaseAuthController',
        'campaign' => 'CampaignController',
        'template' => 'TemplateController',
        'queue'    => 'QueueController',
        'api'      => 'ApiController',
    ],

    'resources' => [],

    'get' => [
        '/'     => 'DashboardController@index',
    ],

    'post' => [],

    'put' => [],

    'delete' => [],

    'excludedCsrf' => [
        'auth/login',
        'auth/session'
    ],

];


if (env("APP_ADMIN", false)) {
    $admin_config = include("admin.php");

    foreach ($admin_config["sections"] as $section) {
        $default['controllers']['admin/' . $section["path"]] = $section["controller"];
    }

    $default['get']['admin/'] = 'Admin\Auth\AdminAuthController@index';
    $default['get']['admin/login'] = 'Admin\Auth\AdminAuthController@getLogin';
    $default['get']['admin/logout'] = 'Admin\Auth\AdminAuthController@getLogout';
    $default['post']['admin/login'] = 'Admin\Auth\AdminAuthController@postLogin';
}

if (env('USER_LOGIN', 'default') != "oauth") {
    $default["controllers"]["password"] = 'Auth\PasswordController';
}

return require 'recursive.php';
