<?php

namespace Stensul\Http\Controllers;

use Auth;
use StensulLocale;
use Storage;
use Stensul\Models\Campaign;
use Illuminate\Http\Request;
use Stensul\Providers\ModuleServiceProvider;

class TemplateController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Template Controller
    |--------------------------------------------------------------------------
    |
    | This controller returns the dynamic templates
    | when you call them from the frontend by ajax.
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Return a module template.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\View\View
     */
    public function getModule(Request $request)
    {

        $campaign_data = $request->has('campaign_id')
            ? Campaign::findOrFail($request->input('campaign_id'))
            : null;

        // Initialize locale and module settings
        $module = [
            "name" => $request->input('name'),
            "app_name" => $request->input('app_name')
        ];
        StensulLocale::init($campaign_data['locale'], $module);

        $options = [];
        $options['params'] = $request->all();
        $options['params']['campaign_data'] = $campaign_data;
        $options["module"] = $request->has('module_data') ? ["data" => $request->input('module_data')] : [];

        $module_params = ModuleServiceProvider::getModule($request->input('name'));
        $module_params['data'] = '';
        $options['module_params'] = $module_params;

        return $this->getComponent($request, 'modules', $options);
    }

    /**
     * Return a modal template.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\View\View
     */
    public function postModal(Request $request)
    {
        $campaign_data = $request->has('campaign_id')
            ? Campaign::findOrFail($request->input('campaign_id'))
            : null;

        // Initialize locale
        if (!empty($campaign_data)) {
            StensulLocale::init($campaign_data['locale']);
        }

        return $this->getComponent($request, 'modals', [ 'params' => $request->all()]);
    }

    /**
     * Return a library images.
     *
     * @param string  $library
     *
     * @return Array images
     */
    public function getLibrary($library)
    {
        $libraries = Storage::disk('local:libraries');

        $library_path = str_replace(public_path(), "", $libraries->getDriver()->getAdapter()->getPathPrefix());

        $files = $libraries->allFiles($library);

        $response_files = [];

        foreach ($files as $file) {
            $response_files[] = $library_path.$file;
        }

        return ["images" => $response_files];
    }

    /**
     * Move a library images to campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return Array image path
     */
    public function postMoveLibrary(Request $request)
    {
        $public = Storage::disk('local:public');
        $campaign_data = Campaign::findOrFail($request->input('campaign_id'));
        $path_old = $request->input('path');
        $campaign_path = $campaign_data->fsRelativePath().DS.pathinfo($path_old)['basename'];
        $path_new = DS."images".DS."campaigns".$campaign_path;

        if (!$public->exists($path_new)) {
            if ($public->exists($path_old)) {
                $public->copy($path_old, $path_new);
            }
        }

        return ["image" => $campaign_path];
    }

    /**
     * Return the email layout for preview.
     *
     * @return \Illuminate\View\View
     */
    public function getEmailPreview($campaign_id = null)
    {
        $campaign_data = isset($campaign_id)
            ? Campaign::findOrFail($campaign_id)
            : null;

        StensulLocale::init($campaign_data['locale']);

        return $this->renderView(
            'layouts.email',
            ['params' => ['title' => 'preview', 'body_html' => '', 'campaign_data' => $campaign_data]]
        );
    }

    /**
     * Returns a renderized view of a modal or a module.
     * Most of the path is created using paramenters from the $request
     * object.
     *
     * @param \Illuminate\Http\Request $request
     * @param  string $type     component type: modal or module
     * @param  array $params additional parameters to send to the view
     * @return \Illuminate\View\View
     */
    protected function getComponent(Request $request, $type, array $params)
    {

        $parts = [];

        // app_name
        $app_name = strtolower($request->input('app_name', 'base'));
        $parts[] = $app_name;


        // push library_name if exists
        $library_name = $request->input('library_name', '');
        (strlen($library_name) && $app_name !== 'base')
            ? $parts[] = $library_name
            : null;

        // type is always required
        $parts[] = $type;

        // component name
        $component = $request->input('name');
        $parts[] = $component;

        // module class
        $class = !empty($params['module_params']['class']) ? $params['module_params']['class'] : $request->input('class');
        $view = $request->input('view', 'template');

        // Find module in [module_name]/module.blade.php
        if ($class == 'pkg') {
            $parts = [ 'modules', $component, $view ];
        }

        return $this->renderView(
            implode('.', $parts),
            $params
        );
    }
}
