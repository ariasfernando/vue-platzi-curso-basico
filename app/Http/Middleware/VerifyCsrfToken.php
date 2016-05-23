<?php

namespace Stensul\Http\Middleware;

use Closure;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;

class VerifyCsrfToken extends BaseVerifier
{
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
        if ($this->isReading($request) || $this->excludedRoutesBuilder($request) || $this->tokensMatch($request)) {
            return $this->addCookieToResponse($request, $next($request));
        }

        abort(403, "CSRF Token Mismatch");
    }

    /**
     * Excluded Routes Builder.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return bool
     */
    protected function excludedRoutesBuilder($request)
    {
        $excludedRoutes = \Config::get('routes.excludedCsrf');

        foreach ($excludedRoutes as $route) {
            if ($request->is($route)) {
                return true;
            }
        }

        return false;
    }
}
