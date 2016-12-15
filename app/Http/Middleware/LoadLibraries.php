<?php

namespace Stensul\Http\Middleware;

use Closure;
use Stensul\Models\Library;

class LoadLibraries
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $libraries = Library::all();

        foreach ($libraries as $library) {

            // Load default config.
            config(['view.libraries.' . $library->name => \Config::get("view.libraries.default", [])]);

            if ($library->config) {
                config(['view.libraries.' . $library->name => $library->config]);
            }
            config(['view.libraries.' . $library->name . '.title' => $library->name]);
        }

        return $next($request);
    }
}
