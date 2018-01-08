<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Session;
use Activity;
use Socialite;
use Stensul\Models\User;
use Stensul\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Guard;
use Stensul\Http\Controllers\Controller;

class OauthAuthController extends Controller
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
    protected $config;
    protected $auth;

    /**
     * Construct.
     *
     * @param Guard     $auth
     */
    public function __construct(Guard $auth)
    {
        $this->config = \Config::get("auth");
        $this->auth = $auth;
    }

    /**
     * Show login view.
     *
     * @return \Illuminate\View\View
     */
    public function getLogin()
    {
        return view('auth.oauth_login');
    }

    /**
     * This initiates a login request.
     *
     */
    public function getOauthLogin()
    {
        return Socialite::driver($this->config['oauth_driver'])
            ->scopes($this->config['oauth_scopes'])
            ->redirect();
    }

    /**
     * Process an incoming oauth2 assertion request.
     *
     * @return \Illuminate\View\View
     */
    public function getSession(Request $request)
    {
        if (is_null($request->input('error'))) {
            $user = Socialite::driver($this->config['oauth_driver'])->user();
            $email = strtolower($user->getEmail());

            if (User::where('email', '=', $email)->where('status', '!=', 'deleted')->exists()) {
                $roles_array = array_column(Role::all(['name'])->toArray(), 'name');
                $user_auth = User::where('email', '=', $email)->firstOrFail();
                if (!$user_auth->trashed()) {
                    if (count($roles_array) != 0 && (count(array_intersect($user_auth->roles, $roles_array)) > 0)) {
                        Auth::login($user_auth, true);
                        Activity::log('User Logged in');
                    } else {
                        $error = array( "message" => "ERROR_ROLE" );
                    }
                } else {
                    $error = Activity::log('User login fail [ERROR_USER]');
                }
            } else {
                $error = array( "message" => "ERROR_EMAIL" );
            }
        } else {
            $error['message'] = $request->input('error');
        }

        if (isset($error)) {
            \Log::error($error);
            return view('auth.session')->with('error', $error['message']);
        } else {
            $redirect_to = Session::has('url.intended') ? Session::get('url.intended') : env('APP_BASE_URL', $this->redirect_to);
            return view('auth.session')->with('redirect_to', $redirect_to);
        }
    }

    /**
     * Logout.
     *
     * @return \Illuminate\Http\RedirectResponse Object
     */
    public function getLogout()
    {
        Auth::logout();
        Session::flush();

        return \Redirect::to($this->redirect_to);
    }
}
