<?php

namespace Stensul\Services;

use Log;
use Bus;
use Auth;
use Mail;
use File;
use Cache;
use Queue;
use Helper;
use Worker;
use Activity;
use MongoDB\BSON\ObjectID as ObjectID;
use Carbon\Carbon;
use Stensul\Models\Campaign;
use Stensul\Jobs\StoreAssetsInCdn;
use Stensul\Jobs\ProcessCampaign;
use HtmlCreator as Html;
use TextCreator as Text;
use Statics as Assets;

/*
|--------------------------------------------------------------------------
| Campaign manager service
|--------------------------------------------------------------------------
|
| This service manage the store of and heavy logic of the campaign
|
*/

class CampaignManager
{
    /**
     * Save campaign.
     *
     * @param array $inputs
     *
     * @return string campaign id
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public static function save($inputs)
    {
        $campaign_id = $inputs['campaign_id'];

        if (isset($campaign_id)) {
            $campaign = Campaign::findOrFail($inputs['campaign_id']);
            $campaign_name = (isset($inputs['campaign_name'])) ? $inputs['campaign_name'] : '';
            $modules_data = (isset($inputs['modules_data'])) ? $inputs['modules_data'] : [];

            $campaign->campaign_name = $campaign_name;
            $campaign->modules_data = $modules_data;
            $campaign->processed = 0;
            $campaign->user_id = new ObjectID(Auth::id());
            $campaign->user_email = Auth::user()->email;

            if (isset($inputs['body_html'])) {
                $campaign->body_html = $inputs['body_html'];
            }

            if (isset($inputs['plain_text'])) {
                $campaign->plain_text = $inputs['plain_text'];
            }

            $campaign->save();

            Activity::log('Campaign updated', array('properties' => ['campaign_id' => new ObjectID($campaign_id)]));
        }

        return $campaign_id;
    }

    /**
     * Delete campaign.
     *
     * @param string $campaign id
     *
     * @return array status
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public static function delete($campaign_id = null)
    {

        if ($campaign_data = Campaign::find($campaign_id)) {
            $campaign_data->status = 2;
            if ($response = $campaign_data->save()) {
                Activity::log('Campaign deleted', array('properties' => ['campaign_id' => new ObjectID($campaign_id)]));
                return array('success' => $campaign_id);
            }
        }

        return array('error' => $campaign_id);
    }

    /**
     * Find campaign.
     *
     * @param string $campaign_id
     *
     * @return array campaign
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public static function find($campaign_id = null)
    {
        $response = false;

        $campaign_data = Campaign::find($campaign_id);

        if (!is_null($campaign_data)) {
            $response = [
                'title' => $campaign_data->campaign_name,
                'locale' => $campaign_data->locale,
                'campaign_id' => $campaign_id,
                'campaign_data' => $campaign_data,
            ];
        }

        return $response;
    }

    /**
     * Create campaign.
     *
     * @param array $data
     *
     * @return \Stensul\Models\Campaign
     */
    public static function create($data = [])
    {
        if (!isset($data['cdn_path']) || !strlen($data['cdn_path'])) {
            $data['cdn_path'] = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyz'), 0, 10);
        }
        $data['user_id'] = new ObjectID(Auth::id());

        $campaign = Campaign::create($data);

        Activity::log('Campaign created', array('properties' => ['campaign_id' => new ObjectID($campaign->id)]));

        //upload assets on save to accelerate user experience
        if (!env('CDN_UPLOAD_PRETEND', false)) {
            Log::info('Upload common assets for campaign [' . $campaign->id . ']');

            dispatch(new StoreAssetsInCdn($campaign));
        }

        return $campaign;
    }

    /**
     * Copy campaign.
     *
     * @param string $campaign_id
     *
     * @return array Campaign id
     */
    public static function copy($campaign_id = null)
    {
        $campaign = Campaign::findOrFail($campaign_id);

        $new_campaign_attr = [];

        $value = null;
        foreach ($campaign->attributesToArray() as $key => $value) {
            if ($campaign->isFillable($key)) {
                $new_campaign_attr[$key] = $campaign->getAttribute($key);
            }
        }

        $new_campaign_attr['campaign_name'] = 'Copy of '.$new_campaign_attr['campaign_name'];
        $new_campaign_attr['processed'] = 0;
        $new_campaign_attr['body_html'] = '';
        $new_campaign_attr['plain_text'] = '';
        unset($new_campaign_attr['published_at']);

        // cdn path must be unique
        // when unset it will be automagically assigned
        unset($new_campaign_attr['cdn_path']);

        $new_campaign = self::create($new_campaign_attr);

        $assets = new Assets($new_campaign);

        $assets->copyAssetsFrom($campaign);

        Activity::log(
            'Campaign cloned',
            array('properties' => ['new_campaign_id' => new ObjectID($new_campaign->id),
            'old_campaign_id' => new ObjectID($campaign_id)])
        );

        return ['campaign_id' => $new_campaign->id];
    }

    /**
     * Process campaign.
     *
     * @param string campaign_id
     *
     * @return array Job id or Campaign id
     */
    public static function process($campaign_id = null)
    {

        $job_id = dispatch(new ProcessCampaign($campaign_id));

        Worker::queue($job_id, 'process');

        $response = !$job_id ? ['processed' => $campaign_id] : ['job' => $job_id];

        return $response;
    }

    /**
     * Plain text of a campaign.
     *
     * @param string $campaign_id
     *
     * @return string Plain text campaign
     */
    public static function text($campaign_id = null)
    {
        $campaign = Campaign::findOrFail($campaign_id);

        if ($campaign->processed == 0) {
            $text = new Text($campaign);
            $response = $text->createTextVersion($campaign['modules_data']);
            Activity::log(
                'Campaign plain text created',
                array('properties' => ['campaign_id' => new ObjectID($campaign_id)])
            );
        } else {
            $response = $campaign->plain_text;
        }

        return $response;
    }

    /**
     * Get Html of the campaign.
     *
     * @param string $campaign_id
     *
     * @return string Html campaign
     */
    public static function html($campaign_id = null)
    {
        $campaign = Campaign::findOrFail($campaign_id);

        return $campaign->body_html;
    }

    /**
     * Upload file to a campaign.
     *
     * @param string $campaign_id
     * @param string $file
     *
     * @return array Path or error
     */
    public static function upload($campaign_id = null, $file = null)
    {
        $response = [];

        $campaign = Campaign::findOrFail($campaign_id);

        if ($file) {
            $assets = new Assets($campaign);
            $response = $assets->saveImage($file);
            Activity::log(
                'Campaign save file',
                array('properties' => ['campaign_id' => new ObjectID($campaign_id)])
            );
        }

        return $response;
    }

    /**
     * Resize Image.
     *
     * @param string $campaign_id
     * @param string $file
     * @param string $width
     * @param string $height
     *
     * @return array Path or error
     */
    public static function resize($campaign_id = null, $file = null, $width = null, $height = null)
    {
        $response = [];

        $campaign = Campaign::findOrFail($campaign_id);

        if ($file) {
            $assets = new Assets($campaign);
            $response = $assets->resizeImage($file, $width, $height);
            Activity::log(
                'Campaign resize image',
                array('properties' => ['campaign_id' => new ObjectID($campaign_id)])
            );
        }

        return $response;
    }

    /**
     * Lock campaign.
     *
     * @param string $campaign_id
     *
     * @return array
     */
    public static function lock($campaign_id = null)
    {

        if (Auth::check()) {
            Cache::add('lock:'.$campaign_id, Auth::id(), Carbon::now()->addMinutes(1));
        }

        return array('locked' => $campaign_id);
    }

    /**
     * Public path of the generated campaign.
     *
     * @param string $campaign_id
     *
     * @return string Path
     */
    public static function publicPath($campaign_id = null)
    {
        $campaign_data = Campaign::findOrFail($campaign_id);
        if ($campaign_data->processed) {
            $path = $campaign_data->getCdnPath(true) . DS . 'index.html';
        } else {
            $path = action('CampaignController@getHtml').'?campaign_id=' . $campaign_id;
        }

        return $path;
    }

    /**
     * Extract og:image from url.
     *
     * @param string $campaign_id
     * @param string $path
     *
     * @return array path or error
     */
    public static function ogExtractor($campaign_id = null, $path = null)
    {
        $campaign = Campaign::findOrFail($campaign_id);

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            $page_content = @file_get_contents($path);

            if ($page_content !== false) {
                $dom_obj = new \DOMDocument();
                @$dom_obj->loadHTML($page_content);
                $meta_val = null;

                foreach ($dom_obj->getElementsByTagName('meta') as $meta) {
                    if ($meta->getAttribute('property') == 'og:image') {
                        $meta_val = $meta->getAttribute('content');
                    }
                }

                if ($meta_val && filter_var($meta_val, FILTER_VALIDATE_URL)) {
                    $assets = new Assets($campaign);
                    $response = $assets->saveImage($meta_val);
                } else {
                    $response['error'] = 'NO_OG_URL';
                }
            } else {
                $response['error'] = 'NO_EXISTS_URL';
            }
        } else {
            $response['error'] = 'NO_VALID_URL';
        }

        return $response;
    }

    /**
     * Create gif with a transparent layer.
     *
     * @param string $campaign_id
     * @param string $gif
     * @param string $layer
     *
     * @return array Path or error
     */
    public static function gifLayer($campaign_id = null, $gif = null, $layer = null)
    {
        $response = [];

        $campaign = Campaign::findOrFail($campaign_id);

        if (!is_null($gif) && !is_null($layer)) {
            $assets = new Assets($campaign);
            $response = $assets->mergeGif($gif, $layer);
            Activity::log(
                'Campaign gif generated file',
                array('properties' => ['campaign_id' => new ObjectID($campaign_id)])
            );
        }

        return $response;
    }

    /**
     * Update email sent history.
     *
     * @param string $campaign_id
     * @param string $mail
     *
     * @return string campaign id
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public static function updateEmailSentHistory($campaign_id, $mail)
    {
        if (isset($campaign_id)) {
            $campaign = Campaign::findOrFail($campaign_id);

            $email_sent_data = [
                'date' => date("Y-m-d h:i:s"),
                'mail' => $mail,
                'user' => Auth::user()->name
            ];

            $campaign->push('email_sent_history', $email_sent_data);
            $campaign->save();

            Activity::log('Campaign updated', array('properties' => ['campaign_id' => new ObjectID($campaign_id)]));
        }

        return $campaign_id;
    }

    /**
     * Get email sent history.
     *
     * @param string $campaign_id
     *
     * @return array email sent history
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public static function getEmailSentHistory($campaign_id)
    {
        $response = false;

        $campaign = Campaign::findOrFail($campaign_id);

        if (!is_null($campaign)) {
            $response = $campaign->email_sent_history;
        }

        return $response;
    }

    /**
     * Create custom image merge.
     *
     * @param string $campaign_id
     * @param string $gif
     * @param string $layer
     *
     * @return array Path or error
     */
    public static function customImageMerge($options = [])
    {
        $response = [];

        if (isset($options["campaign_id"])) {
            $campaign = Campaign::findOrFail($options["campaign_id"]);
            $assets = new Assets($campaign);
            $response = $assets->customMerge($options);
        }

        return $response;
    }
}
