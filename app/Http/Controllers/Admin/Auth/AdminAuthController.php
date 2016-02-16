<?php

namespace Stensul\Http\Controllers\Admin\Auth;

use Auth;
use Session;
use Activity;
use Validator;
use Stensul\Models\User;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Registrar;
use Stensul\Http\Requests\LoginRequest;
use Stensul\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class AdminAuthController extends Controller
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

    protected $redirect_to = '/admin/user';

    use AuthenticatesAndRegistersUsers;

    /**
     * Construct.
     *
     * @param Guard     $auth
     * @param Registrar $registrar
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
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
     * @return \Illuminate\View\View
     */
    public function getLogin()
    {
        return view('base.admin.auth.login');
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
        $app_admin = env('APP_ADMIN', false);
        $attempt_admin = false;

        if ($app_admin && User::where('email', '=', $email)->exists()) {
            $attempt_admin = ( count(array_intersect(User::where('email', '=', $email)->first()->roles, \Config::get("admin.roles"))) > 0 );
        }

        if ($attempt_admin) {
            if ($auth->attempt(['email' => $email, 'password' => $password])) {
                Activity::log('Admin Logged in');
            } else {
                $error = array( "message" => "ERROR_LOGIN" );
            }
        } else {
            $error = array( "message" => "ERROR_ADMIN" );
        }


        if (isset($error)) {
            return redirect()->back()->with($error);
        } else {
            return $this->redirectUser();
        }

    }

    /**
     * Logout.
     *
     * @return \Illuminate\Http\RedirectResponse Object
     */
    public function logout()
    {
        Auth::logout();
        Session::flush();
    }

    /**
     * Logout.
     *
     * @return \Illuminate\Http\RedirectResponse Object
     */
    public function getLogout()
    {
        $this->logout();
        return $this->redirectUser();
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function getRegister()
    {
        return $this->redirectUser();
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function postRegister()
    {
        return $this->redirectUser();
    }

    /**
     * Redirect index
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return $this->redirectUser();
    }

    /**
     * Redirect the user
     *
     * @return \Illuminate\View\View
     */
    public function redirectUser()
    {
        return \Redirect::to($this->redirect_to);
    }
}
