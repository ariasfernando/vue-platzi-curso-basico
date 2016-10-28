<?php

namespace Stensul\Services\Api;

use Auth;
use Cache;
use Activity;
use MongoDB\BSON\ObjectID as ObjectID;
use Carbon\Carbon;
use Folklore\Image\Exception\Exception;
use Stensul\Models\Upload;
use Stensul\Services\Api\SilverpopConnection\SilverpopConnector;

class Silverpop implements ApiConnector
{

    protected $client;
    protected $silverpop_config;

    /**
     * Silverpop constructor.
     *
     */
    public function __construct()
    {
        $this->silverpop_config = \Config::get("api.silverpop");

        try {
            $this->client = new SilverpopConnector(
                $this->silverpop_config["api_path"],
                $this->silverpop_config["user_name"],
                $this->silverpop_config["password"]
            );
        } catch (Exception $e) {
            throw new \Exception($e);
        }
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

        if (!is_null($campaign)) {
            $response = $this->client->saveMailing($campaign, $request);

            if (isset($response["email_id"])) {
                $original_file = (!is_null($request) || isset($request['filename']))? $request['filename'] : '';
                $filename = (isset($response["filename"]))? $response['filename'] : $original_file;

                Activity::log(
                    'Campaign uploaded to Silverpop',
                    [
                        'properties' => [
                            'campaign_id' => new ObjectID($campaign->id),
                            'name' => $filename,
                            'user_id' => new ObjectID(Auth::id())
                        ]
                    ]
                );

                Upload::create(
                    [
                        'api' => 'silverpop',
                        'campaign_id' => new ObjectID($campaign->id),
                        'original_filename' => $original_file,
                        'filename' => $filename,
                        'user_id' => new ObjectID(Auth::id()),
                        'subject' => (!is_null($request) || isset($request['subject']))? $request['subject'] : ''
                    ]
                );

                return [
                    'status' => 'success'
                ];
            } else {
                throw new \Exception("Silverpop api error [ ".$response["error"]." ]");
            }

        } else {
            throw new \Exception("campaign_missing");
        }
    }
}
