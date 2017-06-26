<?php

namespace Stensul\Http\Controllers;

use Config;
use Stensul\Models\Campaign;
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
        $width = \Config::get("view.libraries.default.template_width", '');

        return view(
            'view_in_browser',
            array(
                'campaign_id' =>  $campaign_id,
                'width' => $width
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

    public function getMoco()
    {
        return "hola"
    }
}
