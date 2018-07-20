<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Session;
use Activity;
use Validator;
use UserModel as User;
use RoleModel as Role;
use Stensul\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\RegistersUsers;

class BaseRegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users.
    | By default, this controller usesa simple trait to add these behaviors.
    |
    */

    protected $redirect_to = '/';

    use RegistersUsers;

    /**
     * Construct.
     *
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make(
            $data,
            [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:8',
            ]
        );
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function getRegister()
    {
        $is_registration = env('USER_REGISTRATION', false);

        if (!$is_registration) {
            return redirect(env('APP_BASE_URL', '/'));
        } else {
            $roles = array_column(Role::all(['name'])->toArray(), 'name');
            return view('auth.register')->with('roles', $roles);
        }
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function postRegister(Request $request)
    {

        $is_registration = env('USER_REGISTRATION', false);

        if (!$is_registration) {
            return redirect(env('APP_BASE_URL', '/'));
        } else {
            $validator = $this->validator($request->all())->validate();

            $request->merge(array("password" => bcrypt($request->get("password"))));
            User::create($request->all());
            return \Redirect::to("auth/login")->with("message", "SUCCESS_REGISTERED");
        }
    }
}
