<?php

namespace Stensul\Http\Controllers;

use Stensul\Http\Middleware\Expose;

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
        $this->middleware(Expose::class, ['only' => 'getGet']);
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
        if (config('exposed', false)) {
            return config('exposed.'.$key);
        }

        abort(404);
    }
}
