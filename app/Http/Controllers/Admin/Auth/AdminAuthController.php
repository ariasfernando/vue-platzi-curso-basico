<?php

namespace Stensul\Http\Controllers\Admin\Auth;

use Auth;
use Session;
use Activity;
use Validator;
use Stensul\Models\User;
use Stensul\Http\Requests\LoginRequest;
use Stensul\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

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

    use AuthenticatesUsers;

    /**
     * Construct.
     *
     */
    public function __construct()
    {
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
        return view('base.admin.auth.login');
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
        $app_admin = env('APP_ADMIN', false);
        $attempt_admin = false;

        if ($app_admin && User::where('email', '=', $email)->exists()) {
            $attempt_admin = ( count(array_intersect(User::where('email', '=', $email)
                ->first()->roles, \Config::get("admin.roles"))) > 0 );
        }

        if ($attempt_admin) {
            if ($this::guard()->attempt(['email' => $email, 'password' => $password])) {
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
            return redirect($this->redirect_to);
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
        return redirect('/admin/login');
    }

    /**
     * Redirect index
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return redirect($this->redirect_to);
    }
}
