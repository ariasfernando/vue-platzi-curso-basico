<?php

namespace Stensul\Http\Controllers;

use Config;
use CampaignModel as Campaign;
use LibraryModel as Library;
use Illuminate\Http\Request;
use HtmlCreator as Html;
use StensulLocale;

class PublicController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Public Controller
    |--------------------------------------------------------------------------
    |
    | This controller does not use authentication middleware.
    |
    */

    /**
     * Public view of the processed campaign.
     *
     * @param string $campaign_id
     *
     * @return \Illuminate\Http\RedirectResponse Object | \Illuminate\View\View
     */
    public function view($campaign_id = null)
    {
        $campaign = Campaign::findOrFail($campaign_id);
        return view(
            'view_in_browser',
            array(
                'campaign_id' =>  $campaign_id,
                'params' => [
                    'campaign_data' => $campaign
                ]
            )
        );
    }

    /**
     * Get campaign
     *
     * @param string $campaign_id
     *
     * @return \Illuminate\Http\RedirectResponse Object | \Illuminate\View\View
     */
    public function getCampaign($campaign_id = null)
    {
        $campaign = Campaign::findOrFail($campaign_id);

        $library = Library::findOrFail($campaign['library']);
        $campaign['library_config'] = $library->config;

        return [
            'campaign' => [
                'campaign_id' => $campaign_id,
                'campaign_data' => $campaign,
                'library_config' => $library->config
            ]
        ];
    }

    /**
     * Html of the processed campaign.
     *
     * @param string $campaign_id
     *
     * @return string
     */
    public function html($campaign_id = null)
    {
        $campaign_data = isset($campaign_id)
            ? Campaign::findOrFail($campaign_id)
            : null;
        $library = Library::find($campaign_data->library);

        StensulLocale::init($campaign_data['locale']);

        return $this->renderView(
            'layouts.email',
            ['params' => [
                'title' => 'preview',
                'body_html' => $campaign_data->body_html,
                'campaign_data' => $campaign_data],
                'library_config' => $library->config,
            ]
        );
    }

    /**
     * Show an error page
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\View\View
     */
    public function error(Request $request)
    {
        $params = [
            'error_message' => $request->session()->pull('error_message', 'Something went wrong. Please try again.')
        ];

        return $this->renderView('error', ['params' => $params]);
    }
}
