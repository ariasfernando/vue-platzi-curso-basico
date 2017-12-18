<?php

namespace Stensul\Http\Controllers;

use Auth;
use Cache;
use StensulLocale;
use Activity;
use Campaign;
use EmailSender;
use Stensul\Models\Library;
use Stensul\Services\TagManager as Tag;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID as ObjectID;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
        $this->middleware('acl.permission:edit_campaign');
    }

    /**
     * Show the edit campaign.
     *
     * @return \Illuminate\Http\RedirectResponse Object | \Illuminate\View\View
     * @throws \Exception
     */
    public function getEdit(Request $request, $campaign_id = null)
    {
        if (!is_null($campaign_id)) {
            if (Cache::has('lock:'.$campaign_id) && Cache::get('lock:'.$campaign_id) !== Auth::id()) {
                Activity::log(
                    'Campaign edit deny',
                    array('properties' => ['campaign_id' => new ObjectID($campaign_id)])
                );

                return redirect(env('APP_BASE_URL', '/'))->with('campaign_lock', $campaign_id);
            } else {
                $params = Campaign::find($campaign_id);
                $saved_tags = Tag::all();

                if ($params) {
                    $library_id = (isset($params['campaign_data']) && isset($params['campaign_data']['library']))
                        ? $params['campaign_data']['library']
                        : "default";
                    $library = Library::find($library_id);
                    $params['menu_list'] = $library->getModules();
                    $params['library_config'] = $library->config;
                    $params['campaign_data']['library_name'] = $library->name;
                    uasort($params['menu_list'], function ($menu_item_a, $menu_item_b) {
                        if ($menu_item_a['name'] == $menu_item_b['name']) {
                            return 0;
                        }
                        return ($menu_item_a['name'] < $menu_item_b['name']) ? -1 : 1;
                    });

                    $params['tag_list'] = $saved_tags;
                } else {
                    return redirect(env('APP_BASE_URL', '/'))->with('campaign_not_found', $campaign_id);
                }
            }
        } else {
            $params = [];

            if (!is_null($request->input("locale"))) {
                $params['locale'] = $request->input("locale");
            }
            if (!is_null($request->input("library"))) {
                $params['library'] = new ObjectID($request->input("library"));
            } else {
                $library = Library::orderBy('created_at')->first();
                $libraries = Auth::user()->getLibraries();
                if (count($libraries)) {
                    $params['library'] = new ObjectID($libraries[0]['_id']);
                } else {
                    throw new \Exception('You don\'t have available libraries to create a new email 
                        please contact our support team.');
                }
            }

            $campaign = Campaign::create($params);

            return redirect('campaign/edit/'.$campaign->id);
        }

        if (\Config::get('api.scraper.status')
            && \Config::get('api.scraper.settings.campaign_preload')) {
            Campaign::scraperPreloader(
                $params['campaign_data']['library'],
                ['flush_cache' => true,
                'only_update' => true]
            );
        }

        if (\Config::get('campaign.enable_favorite_template')) {
            $type = \Config::get('campaign.favorite_settings.type');
            if ($type == "global") {
                $params['campaign_data']->isFavorite = $params['campaign_data']->favorite;
            } elseif ($type == "user") {
                $params['campaign_data']->isFavorite = $params['campaign_data']->favorite_user()->exists(Auth::id());
            }
        }

        // Initialize locale
        StensulLocale::init($params['locale']);

        // Default Text
        $params['header_title'] = "Campaign Editor";

        // Set library name
        $library_title = $params['campaign_data']->getLibraryConfig('title');
        if (!empty($library_title)) {
            $params['header_title'] = $library_title;
        }

        // Set language name
        $locale = $params['campaign_data']['locale'];
        if (\Config::get('view.campaign_format') === "languages" && \Config::has('locale.langs.' . $locale . '.name')) {
            $params['header_title'] .= " (" . \Config::get('locale.langs.' . $locale . '.name') . ")";
        }

        if (!is_null($request->input("json"))) {
            return [
                'campaign' => $params
            ];
        }

        return $this->renderView('campaign', array('params' => $params));
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
                array('properties' => ['campaign_id' => new ObjectID($request->input('campaign_id'))])
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
     * Set Favorite.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return string
     *
     * @throws
     */
    public function postFavorite(Request $request)
    {
        if (!Auth::user()->can("access_favorites")) {
            return response()->json([
                'error'   => 'Forbidden'
            ], 403);
        }
        return Campaign::favorite($request->input());
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
        $campaign = Campaign::find($request->input('campaign_id'));
        StensulLocale::init($campaign['locale']);
        if (env('EMAIL_PREVIEW_AS_ATTACHMENT', false)) {
            return EmailSender::sendPreviewAsAttachment(
                $request->input('campaign_id'),
                $request->input('mail'),
                env('SEND_TEXT_EMAIL_ATTACHMENT', true)
            );
        } else {
            $params = [];

            $params['subject'] = $request->input('subject');

            if (isset($campaign['campaign_data']['library_config']['preheader'])
                && $campaign['campaign_data']['library_config']['preheader'] === true) {
                $params['preheader'] = $request->input('preheader');
            }

            return EmailSender::sendPreview($request->input('campaign_id'), $request->input('mail'), $params);
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
        return Campaign::gifLayer(
            $request->input('campaign_id'),
            $request->input('gif_image'),
            $request->input('layer_image')
        );
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

    /**
     *  Create image with custom layers and return local file path.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array Path or error
     */
    public function postCustomImageMerge(Request $request)
    {
        return Campaign::customImageMerge($request->all());
    }

    /**
     *  Create image with a background and layers, and return local file path.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array Path or error
     */
    public function postCompositeImage(Request $request)
    {
        return Campaign::compositeImage($request->all());
    }

    /**
     * Delete a single tag in a Campaign.
     *
     * @param  Request $request
     * @return string  Campaign id
     * @throws \Symfony\Component\HttpKernel\Exception\BadRequestHttpException
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    public function postDeleteTag(Request $request)
    {
        if (Cache::has('lock:'.$request->input('campaign_id'))
            && Cache::get('lock:'.$request->input('campaign_id')) !== Auth::id()
        ) {
            Activity::log(
                'Campaign edit deny',
                array('properties' => ['campaign_id' => new ObjectId($request->input('campaign_id'))])
            );

            return array('campaign_lock' => $request->input('campaign_id'));
        } else {
            if (empty($request->input('campaign_id')) || empty($request->input('tag_name'))) {
                throw new BadRequestHttpException("You must provide 'campaing_id' and 'tag_name' paramters");
            }
            try {
                return Campaign::deleteTag($request->input('campaign_id'), $request->input('tag_name'));
            } catch (Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                throw new NotFoundHttpException(
                    'Campaign with the id ' . $request->input('campaign_id') . ' not found'
                );
            }
        }
    }

    /**
     * Lock the campaign in order to prevent that other user make changes on it.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function postForceLock(Request $request)
    {
        $campaign_id = $request->input('campaign_id');
        if (Cache::has('lock:' . $campaign_id) && Cache::get('lock:'. $campaign_id) !== Auth::id()) {
            Activity::log(
                'Campaign edit deny',
                ['properties' => ['campaign_id' => new ObjectId($campaign_id)]]
            );
            return response(Cache::get('user_lock:'. $campaign_id), 409);
        }
        $data = Campaign::forceLock($campaign_id);
        return response()->json($data);
    }

    /**
     * Unlock a campaign that was locked.
     * @param  Request $request
     * @return Campaign
     */
    public function postUnlockForced(Request $request)
    {
        try {
            $data =  Campaign::unlockForced($request->input('campaign_id'));
            return response()->json($data);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'error'   => 'Forbidden',
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Download campaign HTML.
     * @param  Request $request
     * @param  string $campaign_id
     * @return \Illuminate\Http\Response
     */
    public function getDownloadHtml(Request $request, $campaign_id)
    {
        return Campaign::downloadHtml($campaign_id);
    }

    /**
     *  Update AutoSave campaign attribute
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array status
     */
    public function postUpdateAutoSave(Request $request)
    {
        return Campaign::updateAutoSave($request->input('campaign_id'), $request->input('status'));
    }
}
