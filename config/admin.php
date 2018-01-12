<?php
$overrideFile = (env('APP_NAME', false))
    ? str_replace(basename(__FILE__), ucwords(strtolower(env('APP_NAME'))) . '/' . basename(__FILE__), __FILE__)
    : false;

$default = [

    /*
    |--------------------------------------------------------------------------
    | Limit for amount of users
    |--------------------------------------------------------------------------
    |
    | Admin should only be allowed to have this amount of users.
    |
    */
    "users_limit" => env(APP_USER_LIMIT) ?? 20,

    /*
    |--------------------------------------------------------------------------
    | Administrator Sections
    |--------------------------------------------------------------------------
    |
    */

    "sections" => [
        "users" => [
            "title" => "Users",
            "controller" => 'Admin\UserController',
            "path" => "user",
            "limit_per_page" => 10
        ],
        "roles" => [
            "title" => "Roles",
            "controller" => 'Admin\RoleController',
            "path" => "role",
            "limit_per_page" => 10
        ],
        "permissions" => [
            "title" => "Permissions",
            "controller" => 'Admin\PermissionController',
            "path" => "permission",
            "limit_per_page" => 20
        ],
        "libraries" => [
            "title" => "Libraries",
            "controller" => 'Admin\LibraryController',
            "path" => "library",
            "limit_per_page" => 10
        ],
        "modules" => [
            "title" => "Modules",
            "controller" => 'Admin\ModuleController',
            "path" => "module"
        ],
        "log" => [
            "title" => "Logs",
            "controller" => 'Admin\LogController',
            "path" => "log",
            "limit_per_page" => 20
        ],
    ]

];
return include('recursive.php');
