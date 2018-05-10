<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
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
        URL::forceScheme($schema);
    }
}

Route::resources(Config::get('routes.resources'));

Route::group(['middleware' => ['web']], function () {

    foreach (Config::get('routes.web.get') as $key => $value) {
        Route::get($key, $value);
    }

    foreach (Config::get('routes.web.post') as $key => $value) {
        Route::post($key, $value);
    }

    foreach (Config::get('routes.web.put') as $key => $value) {
        Route::put($key, $value);
    }

    foreach (Config::get('routes.web.delete') as $key => $value) {
        Route::delete($key, $value);
    }
});

Route::group(['middleware' => ['api']], function () {
    foreach (Config::get('routes.api.get') as $key => $value) {
        Route::get($key, $value);
    }

    foreach (Config::get('routes.api.post') as $key => $value) {
        Route::post($key, $value);
    }

    foreach (Config::get('routes.api.put') as $key => $value) {
        Route::put($key, $value);
    }

    foreach (Config::get('routes.api.delete') as $key => $value) {
        Route::delete($key, $value);
    }
});
