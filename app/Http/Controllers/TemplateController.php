<?php

namespace Stensul\Http\Controllers;

use Auth;
use Storage;
use Stensul\Models\Campaign;
use Illuminate\Http\Request;

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

        $options = [];
        $options['params'] = $request->all();
        $options['params']['campaign_data'] = $campaign_data;
        $options["module"] = ($request->has('module_data'))? ["data"=> $request->input('module_data')] : [];

        return $this->getComponent($request, 'modules', $options);
    }

    /**
     * Return a modal template.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\View\View
     */
    public function getModal(Request $request)
    {
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
     * Return a data table of campaigns.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\View\View
     */
    public function getCampaignEditedRows(Request $request)
    {

        $user_visibility = Auth::user()->getLibraries();

        $data_page = $request->input('limit') ?: 5;
        $data_order_field = ($request->input('order_field')) ?: 'updated_at';
        $data_order_type = ($request->input('order_type')) ?: 'DESC';


        $campaign_data = Campaign::edited($user_visibility)
            ->orderBy($data_order_field, $data_order_type)
            ->paginate((int) $data_page)
            ->all();


        return $this->renderView(
            'base.partials.dashboard.draw_campaign_row',
            ['campaigns' => $campaign_data]
        );
    }

    /**
     * Return a data table of campaigns.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\View\View
     */
    public function getCampaignProcessedRows(Request $request)
    {

        $user_visibility = Auth::user()->getLibraries();

        $data_page = $request->input('limit') ?: 5;
        $data_order_field = ($request->input('order_field')) ?: 'updated_at';
        $data_order_type = ($request->input('order_type')) ?: 'DESC';

        $campaign_data = Campaign::processed($user_visibility)
            ->orderBy($data_order_field, $data_order_type)
            ->paginate((int) $data_page)
            ->all();

        return $this->renderView(
            'base.partials.dashboard.draw_processed_campaign_row',
            ['campaigns' => $campaign_data]
        );
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

        return $this->renderView(
            'base.layouts.email',
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
        return $this->renderView(
            implode('.', $parts),
            $params
        );
    }
}
