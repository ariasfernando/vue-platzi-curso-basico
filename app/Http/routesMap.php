<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/**
 * Laravel doesn't get the base url right
 * so we should force it.
 */
if (strlen($base_url = Config::get('app.url')) > 0) {
    URL::forceRootUrl($base_url);

    if (strpos($base_url, 'http') !== false) {
        list($schema, $_) = explode('://', $base_url);
        URL::forceSchema($schema);
    }
}

Route::resources(Config::get('routes.resources'));

Route::controllers(Config::get('routes.controllers'));

foreach (Config::get('routes.get') as $key => $value) {
    Route::get($key, $value);
}

foreach (Config::get('routes.post') as $key => $value) {
    Route::post($key, $value);
}

foreach (Config::get('routes.put') as $key => $value) {
    Route::put($key, $value);
}

foreach (Config::get('routes.delete') as $key => $value) {
    Route::delete($key, $value);
}
