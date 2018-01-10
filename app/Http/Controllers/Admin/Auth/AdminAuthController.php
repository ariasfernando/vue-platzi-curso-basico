<?php

namespace Stensul\Http\Controllers\Admin\Auth;

use Auth;
use Session;
use Activity;
use Validator;
use PasswordPolicy;
use Stensul\Models\User;
use Stensul\Http\Requests\LoginRequest;
use Stensul\Http\Controllers\Auth\BaseLoginController;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class AdminAuthController extends BaseLoginController
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
    protected $is_admin = true;

    use AuthenticatesUsers;

    /**
     * Construct.
     *
     */
    public function __construct()
    {
    }

    /**
     * Redirect index
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return redirect(\Config::get('app.url') . $this->redirect_to);
    }
}
