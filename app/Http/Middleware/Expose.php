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
                 * $data is in the form value or value.key || value.key.another_key || []
                 * maybe do this recursive?
                 */
                foreach ($map as $data_name => $data) {
                    if (is_array($data)) {
                        foreach ($data as $data_key) {
                            if (array_has(config($key.'.'.$data_name), $data_key)) {
                                config(['exposed.'.$key.'.'.$data_name.'.'.$data_key => config($key.'.'.$data_name.'.'.$data_key)]);
                            }
                        }
                    } else
                    if (array_has(config($key), $data)) {
                        config(['exposed.'.$key.'.'.$data => config($key.'.'.$data)]);
                    }
                }
            } elseif ($map === '*') {
                config(['exposed.'.$key =>  config($key)]);
            }
        }
        return $next($request);
    }
}
