<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Cache;
use Session;
use Activity;
use Validator;
use Challenge;
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
            'password' => 'required|confirmed|min:6',
            ]
        );
    }

    /**
     * Show login view.
     *
     * @param Request $request
     *
     * @return \Illuminate\View\View
     */
    public function getLogin(Request $request)
    {
        if (\Config::get('challenge.enabled')) {
            $challenge_provider = \Config::get('challenge.default');
            $config = \Config::get('challenge.providers.' . $challenge_provider);
            $cache_key = $config['cache_key'] . $request->ip();
            if (Cache::get($cache_key) >= $config['max_failed_attemtps']) {
                return view('base.auth.login')
                        ->with('challenge_key', $config['key'])
                        ->with('challenge_provider', $challenge_provider);
            }
        }
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
        $error = false;

        if (\Config::get('challenge.enabled')) {
            $challenge_provider = \Config::get('challenge.default');
            $config = \Config::get('challenge.providers.' . $challenge_provider);
            $cache_key = $config['cache_key'] . $request->ip();

            if (!Cache::add($cache_key, 1, $config['max_timeout'])) {
                Cache::increment($cache_key);
            }
            if (Cache::get($cache_key) > $config['max_failed_attemtps'] && !Challenge::provider()->isValid($request)) {
                Activity::log('User login fail [ERROR_CAPTCHA]');
                $error = true;
            }
        }

        $email = strtolower($request->input('email'));
        $password = $request->input('password');
        $remember = $request->input('remember');

        if (User::where('email', '=', $email)->exists() && !$error) {
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
                    Activity::log('User login fail [ERROR_ROLE]');
                    $error = true;
                }
            } else {
                Activity::log('User login fail [ERROR_LOGIN]');
                $error = true;
            }
        } else {
            Activity::log('User login fail [ERROR_EMAIL]');
            $error = true;
        }

        if ($error) {
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
