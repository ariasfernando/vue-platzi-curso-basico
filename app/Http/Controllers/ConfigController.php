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
    public function getGet($key = null)
    {
        return config($key);
    }
}
