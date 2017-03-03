<?php

namespace Stensul\Http\Middleware;

use Auth;
use Closure;
use PasswordPolicy;
use Illuminate\Contracts\Auth\Guard;

class Authenticate
{
    /**
     * The Guard implementation.
     *
     * @var Guard
     */
    protected $auth;

    /**
     * Create a new filter instance.
     *
     * @param Guard $auth
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $validUser = true;
        if ($this->auth->guest()) {
            if ($request->ajax()) {
                return response('Unauthorized.', 401);
            } else {
                $validUser = false;
            }
        } else {
            if (Auth::check()) {
                if (count(Auth::user()->getRoles()->toArray()) === 0) {
                    Auth::logout();
                    $validUser = false;
                }
                if (PasswordPolicy::should_update_password(Auth::user())) {
                    return redirect()->guest('password/change');
                }
            }
        }

        if (!$validUser) {
            return redirect()->guest('auth/login');
        } else {
            return $next($request);
        }
    }
}
