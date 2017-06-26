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
                return view('auth.login')
                        ->with('challenge_key', $config['key'])
                        ->with('challenge_provider', $challenge_provider);
            }
        }
        return view('auth.login');
    }

    /**
     * Try to login.
     *
     * @param LoginRequest $request
     * @return \Illuminate\Http\$this
     */
    public function postLogin(LoginRequest $request)
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
}
