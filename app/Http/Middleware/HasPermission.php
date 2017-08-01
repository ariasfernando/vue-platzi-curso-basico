<?php

namespace Stensul\Http\Middleware;

use Auth;
use Session;
use Closure;

class HasPermission
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     * @param String                   $permission
     *
     * @return mixed
     */
    public function handle($request, Closure $next, $permission)
    {
        if (Auth::check() && Auth::user()->can($permission)) {
            return $next($request);
        }

        if ($request->ajax()) {
            return response('Unauthorized.', 401);
        } else {
            $request->session()->flash('error_message', 'Your user isn\'t authorized to access this page. If you feel this is an error, please reach out to your account team.');
            return redirect(url('error'));
        }
    }
}
