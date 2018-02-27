<?php

namespace Stensul\Http\Controllers;

use Auth;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Stensul\Providers\HelperServiceProvider as Helper;
use Illuminate\Foundation\Validation\ValidatesRequests;

abstract class Controller extends BaseController
{
    use DispatchesJobs, ValidatesRequests;

    /**
     * Render View.
     *
     * @param string $view
     * @param array  $params
     * @param bool   $use_force
     *
     * @return \Illuminate\View\$this
     */
    protected function renderView($view, $params = array(), $use_force = true)
    {
        $params['params'] = isset($params['params']) ? $params['params'] : [];
        return view($view)->with($params);
    }
}
