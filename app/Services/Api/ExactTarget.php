<?php

namespace Stensul\Services\Api;

use Auth;
use Activity;
use UploadModel as Upload;
use Stensul\Services\Api\ExactTargetConnection\ExactTargetConnector;
use MongoDB\BSON\ObjectID as ObjectID;

class ExactTarget implements ApiConnector
{

    private $client;
    private $library_name;

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
        if ($campaign->library) {
            $this->library_name = $campaign->library;
        } elseif (array_key_exists('library_name', $request)) {
            $this->library_name = $request['library_name'];
        }
        $this->client->setLibraryName($this->library_name);

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
                'Campaign uploaded to SFMC',
                [
                    'properties' => [
                        'campaign_id' => new ObjectID($campaign->id),
                        'name' => $campaign->campaign_name,
                        'user_id' => new ObjectID(Auth::id())
                    ]
                ]
            );

            Upload::create(
                [
                    'api' => 'exact_target',
                    'campaign_id' => new ObjectID($campaign->id),
                    'original_filename' => $campaign->campaign_name,
                    'filename' => $campaign->campaign_name,
                    'user_id' => new ObjectID(Auth::id()),
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

    public function getClient()
    {
        return $this->client;
    }
}
