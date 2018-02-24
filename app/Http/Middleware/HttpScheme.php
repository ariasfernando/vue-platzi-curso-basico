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
        if (\Config::get('app.scheme') === 'https') {
            $request->setTrustedProxies([$request->getClientIp()]); 
            return redirect()->secure($request->getRequestUri());
        }

        return $next($request); 
    }
}
