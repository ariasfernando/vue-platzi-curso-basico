<?php

namespace Stensul\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Contracts\Auth\Guard;

class AdminAuthenticate
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
        $isAjax = ($request->ajax());

        if (Auth::check()) {
            if (!Auth::user()->can('access_admin')) {
                return $this->reject($isAjax);
            }
        } else {
            return $this->reject($isAjax);
        }

        return $next($request);
    }

    /**
     * Reject
     * @param boolean $isAjax
     * @return \Symfony\Component\HttpFoundation\Response|\Illuminate\Contracts\Routing\ResponseFactory
     */
    private function reject($isAjax)
    {
        if ($isAjax) {
            return response('Unauthorized.', 401);
        } else {
            return \Redirect::to("admin/login");
        }
    }
}
