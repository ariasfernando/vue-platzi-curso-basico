<?php

namespace Stensul\Services\Api;

use Auth;
use Cache;
use Activity;
use UploadModel as Upload;
use Stensul\Services\Api\StrongviewConnection\StrongviewConnector;
use MongoDB\BSON\ObjectID as ObjectID;

class Strongview implements ApiConnector
{

    protected $client;
    protected $strongview_config;

    /**
     * Strongview constructor.
     *
     */
    public function __construct()
    {
        $this->strongview_config = \Config::get("api.strongview");

        $this->client = new StrongviewConnector(
            trim(
                $this->strongview_config['api_host'] . $this->strongview_config['api_wsdl']
            ),
            $this->strongview_config["organization"],
            $this->strongview_config["user_name"],
            $this->strongview_config["password"],
            $this->strongview_config["sub_organization"],
            $this->strongview_config["allow_self_signed_cert"]
        );
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
            $library_name = $campaign->library;
        } elseif (array_key_exists('library_name', $request)) {
            $library_name = $request['library_name'];
        }
        if (isset($library_name) && !empty($this->strongview_config['libraries'][$library_name])) {
            $this->client = new StrongviewConnection(
                trim(
                    $this->strongview_config['libraries'][$library_name]['api_host'] .
                    $this->strongview_config['libraries'][$library_name]['api_wsdl']
                ),
                $this->strongview_config['libraries'][$library_name]['organization'],
                $this->strongview_config['libraries'][$library_name]['user_name'],
                $this->strongview_config['libraries'][$library_name]['password'],
                $this->strongview_config['libraries'][$library_name]['sub_organization'],
                $this->strongview_config['libraries'][$library_name]['allow_self_signed_cert']
            );
        }
        
        $response = $this->client->saveMailing($campaign, $request);

        $original_file = (!is_null($request) || isset($request['filename']))? $request['filename'] : '';
        $filename = (isset($response["filename"]))? $response['filename'] : $original_file;

        Activity::log(
            'Campaign uploaded to Strongview',
            [
                'properties' => [
                    'campaign_id' => new ObjectId($campaign->id),
                    'name' => $filename,
                    'user_id' => new ObjectId(Auth::id())
                ]
            ]
        );

        Upload::create(
            [
                'api' => 'strongview',
                'campaign_id' => new ObjectId($campaign->id),
                'original_filename' => $original_file,
                'filename' => $filename,
                'user_id' => new ObjectId(Auth::id()),
                'subject' => (!is_null($request) || isset($request['subject']))? $request['subject'] : ''
            ]
        );

        return [
            'status' => 'success'
        ];
    }
}
