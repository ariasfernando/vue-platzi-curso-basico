<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Session;
use Activity;
use Validator;
use Stensul\Models\User;
use Stensul\Models\Role;
use Stensul\Http\Requests\LoginRequest;
use Stensul\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class BaseLoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the authentication of existing users.
    | By default, this controller uses a simple trait to add these behaviors.
    |
    */

    protected $redirect_to = '/';

    use AuthenticatesUsers;

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
     * Show login view.
     *
     * @return \Illuminate\View\View
     */
    public function getLogin()
    {
        return view('base.auth.login');
    }

    /**
     * Try to login.
     *
     * @param LoginRequest $request
     * @return \Illuminate\Http\$this
     */
    public function postLogin(LoginRequest $request)
    {
        $email = strtolower($request->input('email'));
        $password = $request->input('password');
        $remember = $request->input('remember');
        if (User::where('email', '=', $email)->exists()) {

            $auth = $this::guard();

            if ($auth->validate(['email' => $email, 'password' => $password])) {
                $roles_array = array_column(Role::all(['name'])->toArray(), 'name');
                $user_roles = User::where('email', '=', $email)->firstOrFail()->roles;

                if (count($roles_array) != 0 && (count(array_intersect($user_roles, $roles_array)) > 0)) {
                    if ($auth->attempt(['email' => $email, 'password' => $password], $remember)
                        || $auth->viaRemember()
                    ) {

                        Activity::log('User Logged in');
                    }
                } else {
                    $error = Activity::log('User login fail [ERROR_ROLE]');
                }
            } else {
                $error = Activity::log('User login fail [ERROR_LOGIN]');
            }

        } else {
            $error = Activity::log('User login fail [ERROR_EMAIL]');
        }
        if (isset($error)) {
            return redirect()->back()->with(array("message" => "ERROR_DEFAULT"));
        } else {
            if (isset($user_data) && isset($user_data->force_password)
                && $user_data->force_password == 1
                && env('USER_FORCE_PASSWORD', true)
            ) {
                return \Redirect::to('password/change');
            } else {
                return \Redirect::to($this->redirect_to);
            }
        }

    }

    /**
     * Logout.
     *
     * @return \Illuminate\Http\RedirectResponse Object
     */
    public function getLogout()
    {
        Activity::log('User Logged out');
        Auth::logout();
        Session::flush();

        return \Redirect::to($this->redirect_to);
    }

}
