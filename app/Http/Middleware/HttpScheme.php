<?php

namespace Stensul\Http\Middleware;
use Closure;

class HttpScheme
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
    public function handle($request, Closure $next)
    {
        if (!$request->secure() && \Config::get('app.scheme') === 'https') {

            return redirect()->secure($request->getRequestUri());
        }

        return $next($request); 
    }
}
