<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Administrator Roles
    |--------------------------------------------------------------------------
    | This users can see the admin section that are allowed.
    |
    */

    "roles" => [ "owner"],

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
            "path" => "user"
        ],
        "roles" => [
            "title" => "Roles",
            "controller" => 'Admin\RoleController',
            "path" => "role"
        ],
        "permissions" => [
            "title" => "Permissions",
            "controller" => 'Admin\PermissionController',
            "path" => "permission"
        ],
        "log" => [
            "title" => "Logs",
            "controller" => 'Admin\LogController',
            "path" => "log"
        ],
    ]

];
