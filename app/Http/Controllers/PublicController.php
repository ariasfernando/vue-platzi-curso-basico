<?php

namespace Stensul\Http\Controllers;

use Config;
use Stensul\Models\Campaign;
use Illuminate\Http\Request;
use Stensul\Services\EmailHtmlCreator as Html;

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
        // dd($campaign);
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
     * Html of the processed campaign.
     *
     * @param string $campaign_id
     *
     * @return string
     */
    public function html($campaign_id = null)
    {
        $campaign = Campaign::findOrFail($campaign_id);
        $html = new Html($campaign);
        return $html->getBody();
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
