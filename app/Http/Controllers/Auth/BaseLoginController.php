<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Cache;
use Session;
use Activity;
use Validator;
use Challenge;
use PasswordPolicy;
use UserModel as User;
use RoleModel as Role;
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
    protected $is_admin = false;

    use AuthenticatesUsers;

    /**
     * Construct.
     *
     */
    public function __construct(Request $request)
    {
        $this->middleware('guest', ['except' => 'getLogout']);
        if ($request->is('admin/*')) {
            $this->is_admin = true;
        }
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
                'password' => PasswordPolicy::password_rule($data),
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
                        ->with('challenge_provider', $challenge_provider)
                        ->with('is_admin', $this->is_admin);
            }
        }

        return view('auth.login')
            ->with('is_admin', $this->is_admin);
    }

    /**
     * Try to login.
     *
     * @param Request $request
     * @return \Illuminate\Http\$this
     */
    public function postLogin(Request $request)
    {
        if (\Config::get('challenge.enabled')) {
            $challenge_provider = \Config::get('challenge.default');
            $config = \Config::get('challenge.providers.' . $challenge_provider);
            $cache_key = $config['cache_key'] . $request->ip();

            if (!Cache::add($cache_key, 1, $config['max_timeout'])) {
                Cache::increment($cache_key);
            }
            if (Cache::get($cache_key) > $config['max_failed_attemtps'] && !Challenge::provider()->isValid($request)) {
                Activity::log('User login fail [ERROR_CAPTCHA]');
                return $this->returnWithError('ERROR_CAPTCHA');
            }
        }

        $email = strtolower($request->input('email'));
        $password = $request->input('password');
        $remember = $request->input('remember');

        $auth = $this::guard();

        if (!$auth->validate(['email' => $email, 'password' => $password])) {
            Activity::log('User login fail [ERROR_LOGIN]');
            return $this->returnWithError();
        }

        $user = User::where('email', '=', $email)->first();

        if (!$user) {
            Activity::log('User login fail [ERROR_EMAIL]');
            return $this->returnWithError();
        }

        if ($this->is_admin && !$user->can('access_admin')) {
            Activity::log('User login fail [ERROR_ADMIN]');
            return $this->returnWithError();
        }

        if ($auth->attempt(['email' => $email, 'password' => $password], $remember)
            || $auth->viaRemember()
        ) {
            if ($this->is_admin) {
                Activity::log('Admin Logged in');
            } else {
                Activity::log('User Logged in');
            }
            if ($user->unconfirmed) {
                $user->unconfirmed = 0;
                $user->save();
            }
        }

        if (PasswordPolicy::should_update_password($user)) {
            return redirect('password/change');
        } else {
            if ($this->is_admin) {
                return redirect('/admin');
            }
            return redirect()->intended($this->redirect_to);
        }
    }

    private function returnWithError($message = 'ERROR_DEFAULT')
    {
        return redirect()->back()->with('message', $message);
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
