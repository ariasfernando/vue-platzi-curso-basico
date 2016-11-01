<?php

namespace Stensul\Services\Api;

use Auth;
use Activity;
use Stensul\Models\Upload;
use Stensul\Services\Api\ExactTargetConnection\ExactTargetConnector;

class ExactTarget implements ApiConnector
{

    private $client;

    /**
     * Constructor
     * @param ExactTargetConnector $exactTargetConnector
     */
    public function __construct(ExactTargetConnector $exactTargetConnector)
    {
        $this->client = $exactTargetConnector;
    }

    /**
     * Upload email
     *
     * @param Object $campaign
     *
     * @return array $response
     */
    public function uploadEmail($campaign = null, $request = null)
    {
        $check_email = $this->client->retrieveEmails($campaign->id);

        if (count($check_email->results) === 0) {
            $response = $this->client->createEmail($campaign, $request);
        } else {
            if (isset($check_email->results[0]->ID) && !is_null($check_email->results[0]->ID)) {
                $response = $this->client->updateEmail($check_email->results[0]->ID, $campaign, $request);
            }
        }

        if (isset($response->results)) {
            Activity::log(
                'Campaign uploaded to Exact Target',
                [
                    'properties' => [
                        'campaign_id' => new \MongoId($campaign->id),
                        'name' => $campaign->campaign_name,
                        'user_id' => new \MongoId(Auth::id())
                    ]
                ]
            );

            Upload::create(
                [
                    'api' => 'exact_target',
                    'campaign_id' => new \MongoId($campaign->id),
                    'original_filename' => $campaign->campaign_name,
                    'filename' => $campaign->campaign_name,
                    'user_id' => new \MongoId(Auth::id()),
                    'subject' => (!is_null($request) || isset($request['subject']))? $request['subject'] : '',
                    'preheader' => (!is_null($request) || isset($request['preheader']))? $request['preheader'] : '',
                ]
            );

            return [
                'status' => 'success'
            ];
        } else {
            throw new \Exception("Exact target error [ ".$response->message." ]");
        }
    }

    /**
     * List forders
     *
     * @return array $response
     */
    public function listFolders()
    {
        return $this->client->getFolders();
    }
}
