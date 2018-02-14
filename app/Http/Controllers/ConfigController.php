<?php

namespace Stensul\Http\Controllers;

class ConfigController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Config Controller
    |--------------------------------------------------------------------------
    |
    | This controller is to interact with the config.
    |
    */

    private static $whitelist = [
        'admin',
        'global_settings',
        'campaign',
        'locale',
        'menu',
        'modals',
        'modules',
        'proof',
        'view',
        'api.eloqua',
        'api.silverpop'
    ];

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get config value from a key.
     *
     * @params string $key
     *
     * @return config value
     */
    public function getGet($key)
    {
        if (preg_match("/^global_settings\./", $key) || in_array($key, self::$whitelist)) {
            return config($key);
        }

        abort(404);
    }
}
