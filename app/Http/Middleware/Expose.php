<?php

namespace Stensul\Http\Middleware;

use Auth;
use Session;
use Closure;

class Expose
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     * @param String                   $config_name
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $key = $request->key;
        $key = preg_replace('/([^A-Za-z_\.])/', '', $key);
        $map = config('expose.'.$key);
        $source = config($key);
        if (count($source)) {
            if (is_array($map) && count($map)) {
                /**
                 * $v is in the form value or value.key or value.key.another_key
                 */
                foreach ($map as $v) {
                    if (array_has(config($key), $v)) {
                        config(['exposed.'.$key.'.'.$v => config($key.'.'.$v)]);
                    }
                }
            } elseif ($map === '*') {
                config(['exposed.'.$key =>  config($key)]);
            }
        }
        return $next($request);
    }

}
