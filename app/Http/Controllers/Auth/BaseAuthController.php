<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Session;
use Activity;
use Validator;
use Stensul\Models\User;
use Stensul\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Registrar;
use Stensul\Http\Requests\LoginRequest;
use Stensul\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class BaseAuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    protected $redirect_to = '/';

    use AuthenticatesAndRegistersUsers;

    /**
     * Construct.
     *
     * @param Guard     $auth
     * @param Registrar $registrar
     */
    public function __construct(Guard $auth, Registrar $registrar)
    {
        $this->auth = $auth;
        $this->registrar = $registrar;

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
     * @param Guard        $auth
     *
     * @return \Illuminate\Http\$this
     */
    public function postLogin(LoginRequest $request, Guard $auth)
    {
        $email = strtolower($request->input('email'));
        $password = $request->input('password');
        $remember = $request->input('remember');

        if (User::where('email', '=', $email)->exists()) {
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

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function getRegister()
    {
        $is_registration = env('USER_REGISTRATION', true);

        if (!$is_registration) {
            return redirect(env('APP_BASE_URL', '/'));
        } else {
            $roles = array_column(Role::all(['name'])->toArray(), 'name');
            return view('base.auth.register')->with('roles', $roles);
        }
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function postRegister(Request $request)
    {

        $is_registration = env('USER_REGISTRATION', true);

        if (!$is_registration) {
            return redirect(env('APP_BASE_URL', '/'));
        } else {
            $validator = $this->registrar->validator($request->all());

            if ($validator->fails()) {
                $this->throwValidationException(
                    $request,
                    $validator
                );
            }

            $request->merge(array("password" => bcrypt($request->get("password"))));
            User::create($request->all());
            return \Redirect::to("auth/login")->with("message", "SUCCESS_REGISTERED");
        }
    }
}
