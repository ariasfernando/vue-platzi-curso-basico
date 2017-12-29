<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use Stensul\Models\Setting;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;

class SettingController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Settings administrator Controller
    |--------------------------------------------------------------------------
    |
    | This controller serve a CRUD por the setting model
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('AdminAuthenticate');
        $this->middleware('acl.permission:access_admin_settings');
    }

    /**
     * Show the settings admin view.
     *
     * @return View
     */
    public function getIndex()
    {
        $global_settings = Setting::all(['name', 'key', 'value'])->toArray();

        return $this->renderView('admin.settings', ['global_settings' => $global_settings]);
    }

        /**
     * Show the settings admin view.
     *
     * @return View
     */
    public function postEdit(Request $request)
    {
        $key = $request->input('key');
        $setting = Setting::where('key', '=', $key)->firstOrFail();
        $setting->value = $request->input('value');
        
        try {
            $setting->save();
            $response_message = ['message' => 'SUCCESS'];
        } catch (\Exception $exception) {
            $response_message = ['message' => 'ERROR_SAVING'];
        }

        return $response_message;
    }
}
