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
    "users_limit" => env('APP_USER_LIMIT') ?? 1000,

    /*
    |--------------------------------------------------------------------------
    | Administrator Sections
    |--------------------------------------------------------------------------
    |
    */

    "sections" => [
        "users" => [
            "title" => "Users",
            "icon" => "user",
            "children" => [
                "list" => [
                    "title" => "List",
                    "action" => "Admin\UserController@getIndex",
                    "icon" => "list",
                    "permission" => "access_admin_users"
                ],
                "roles" => [
                    "title" => "Roles",
                    "action" => "Admin\RoleController@getIndex",
                    "icon" => "cog",
                    "permission" => "access_admin_roles"
                ],
                "permission" => [
                    "title" => "Permissions",
                    "action" => "Admin\PermissionController@getIndex",
                    "icon" => "lock",
                    "permission" => "access_admin_permissions"
                ],
            ]
        ],
        "settings" => [
            "title" => "Global Settings",
            "icon" => "list-alt",
            "action" => "Admin\SettingController@getIndex",
            "permission" => "access_admin_settings"
        ],
        "studio" => [
            "title" => "Studio",
            "icon" => "th-large",
            "children" => [
                "library" => [
                    "title" => "Libraries",
                    "action" => "Admin\LibraryController@getIndex",
                    "icon" => "folder-open",
                    "permission" => "access_admin_studio_libraries"
                ],
                "module" => [
                    "title" => "Modules",
                    "action" => "Admin\ModuleController@getIndex",
                    "icon" => "th-list",
                    "permission" => "access_admin_studio_modules"
                ]
            ]
        ],
        "log" => [
            "title" => "Logs",
            "action" => 'Admin\LogController@getIndex',
            "icon" => "menu-hamburger",
            "permission" => "access_admin_logs"
        ]
    ]

];
return include('recursive.php');
