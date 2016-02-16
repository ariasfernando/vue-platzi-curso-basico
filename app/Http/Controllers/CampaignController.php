<?php

namespace Stensul\Http\Controllers;

use Auth;
use Cache;
use Activity;
use Campaign;
use EmailSender;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Campaign
    |--------------------------------------------------------------------------
    |
    | This controller renders the campaign.
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
     * Show the edit campaign.
     *
     * @return \Illuminate\Http\RedirectResponse Object | \Illuminate\View\View
     */
    public function getEdit(Request $request, $campaign_id = null)
    {
        if (!is_null($campaign_id)) {
            if (Cache::has('lock:'.$campaign_id) && Cache::get('lock:'.$campaign_id) !== Auth::id()) {
                Activity::log(
                    'Campaign edit deny',
                    array('properties' => ['campaign_id' => new \MongoId($campaign_id)])
                );

                return redirect(env('APP_BASE_URL', '/'))->with('campaign_lock', $campaign_id);
            } else {
                $params = Campaign::find($campaign_id);

                if ($params) {
                    $params['menu_list'] = \Config::get('menu.default');
                } else {
                    return redirect(env('APP_BASE_URL', '/'))->with('campaign_not_found', $campaign_id);
                }
            }
        } else {
            $params = [
                'user_id' => Auth::id(),
                'user_email' => Auth::user()->email
                ];

            if (!is_null($request->input("locales"))) {
                $params['locale'] = $request->input("locales");
            }
            if (!is_null($request->input("library"))) {
                $params['library'] = $request->input("library");
            }

            $campaign = Campaign::create($params);

            return redirect('campaign/edit/'.$campaign->id);
        }

        return $this->renderView('base.campaign', array('params' => $params));
    }

    /**
     * Delete campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     *
     * @throws \Exception
     */
    public function postDelete(Request $request)
    {
        if (Cache::has('lock:'.$request->input('campaign_id'))
            && Cache::get('lock:'.$request->input('campaign_id')) !== Auth::id()
        ) {
            Activity::log(
                'Campaign edit deny',
                array('properties' => ['campaign_id' => new \MongoId($request->input('campaign_id'))])
            );

            return array('campaign_lock' => $request->input('campaign_id'));
        } else {
            return Campaign::delete($request->input('campaign_id'));
        }
    }

    /**
     * Save draft.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return string Campaign id.
     */
    public function postSave(Request $request)
    {
        return Campaign::save($request->input());
    }

    /**
     * Clone a Campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function postClone(Request $request)
    {
        return Campaign::copy($request->input('campaign_id'));
    }

    /**
     * Process a Campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function postProcess(Request $request)
    {
        return Campaign::process($request->input('campaign_id'));
    }

    /**
     * Get plain text of the Campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return string
     */
    public function getPlainText(Request $request)
    {
        return Campaign::text($request->input('campaign_id'));
    }

    /**
     * Get Html content of the Campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return string
     */
    public function getHtml(Request $request)
    {
        return Campaign::html($request->input('campaign_id'));
    }

    /**
     * Upload Image to the Campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function postUploadImage(Request $request)
    {
        return Campaign::upload($request->input('campaign_id'), $request->input('data_image'));
    }

    /**
     * Resize Image.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function postResizeImage(Request $request)
    {
        return Campaign::resize(
            $request->input('campaign_id'),
            $request->input('data_image'),
            $request->input('data_width'),
            $request->input('data_height')
        );
    }

    /**
     * Send campaign preview.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function postSendPreview(Request $request)
    {
        if (env('EMAIL_PREVIEW_AS_ATTACHMENT', false)) {
            return EmailSender::sendPreviewAsAttachment(
                $request->input('campaign_id'),
                $request->input('mail'),
                env('SEND_TEXT_EMAIL_ATTACHMENT', true)
            );
        } else {
            return EmailSender::sendPreview($request->input('campaign_id'), $request->input('mail'));
        }
    }

    /**
     * Lock campaign.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function postLock(Request $request)
    {
        return Campaign::lock($request->input('campaign_id'));
    }

    /**
     *  Public path of the generated campaign.
     *
     * @param string $campaign_id
     *
     * @return \Illuminate\Http\RedirectResponse Object
     */
    public function getPublicPath($campaign_id = null)
    {
        return \Redirect::to(Campaign::publicPath($campaign_id));
    }

    /**
     *  Create image from og:image and return local file path.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array Path or error
     */
    public function postOgImage(Request $request)
    {
        return Campaign::ogExtractor($request->input('campaign_id'), $request->input('path'));
    }

    /**
     *  Create an animated gif with a transparent layer.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array Path or error
     */
    public function postGifLayer(Request $request)
    {
        return Campaign::gifLayer($request->input('campaign_id'), $request->input('gif_image'), $request->input('layer_image'));
    }

    /**
     *  Get emails sent history
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array Emails or error
     */
    public function postEmailSentHistory(Request $request)
    {
        return Campaign::getEmailSentHistory($request->input('campaign_id'));
    }
}
