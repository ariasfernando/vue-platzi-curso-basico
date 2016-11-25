<?php

namespace Stensul\Services\Api;

use Auth;
use Cache;
use Activity;
use Carbon\Carbon;
use Stensul\Models\Upload;
use GuzzleHttp\Client as Client;
use MongoDB\BSON\ObjectID as ObjectID;

class Eloqua implements ApiConnector
{
    private $client;
    private $eloqua_config;
    private $api_version = "2.0";
    private $flushed_cache = false;

    /**
     * Eloqua constructor.
     *
     */
    public function __construct()
    {
        $this->client = new Client();
        $this->eloqua_config = \Config::get("api.eloqua");
    }

    /**
     * Get eloqua token.
     *
     * @return String access_token
     */
    private function getToken()
    {
        $eloqua_config = $this->eloqua_config;

        if (Cache::has('api:eloqua:token')) {
            $eloqua_token = Cache::get('api:eloqua:token');
        } else {
            $options = [
                'base_url' => $eloqua_config['auth']['base_url'],
                'path' => $eloqua_config['auth']['path'],
                'type' => $eloqua_config['auth']['type'],
                'params' => [
                    'auth' => [
                        $eloqua_config['auth']['credentials']['client_id'],
                        $eloqua_config['auth']['credentials']['client_secret']
                    ],
                    'json' => [
                        "grant_type" => "password",
                        "scope"      => "full",
                        "password"   => $eloqua_config['auth']['credentials']['password'],
                        "username"   => $eloqua_config['auth']['credentials']['company_name']. "\\"
                            .$eloqua_config['auth']['credentials']['user_name']
                    ],
                ]
            ];

            $response = $this->call($options);
            $credentials = $response;
            $eloqua_token = $credentials['access_token'];
            Cache::add('api:eloqua:token', $eloqua_token, Carbon::now()->addHours(1));
        }

        return $eloqua_token;
    }

    /**
     * Get base url for api connection.
     *
     * @return String base_url
     */
    private function getBaseUrl()
    {

        $eloqua_config = $this->eloqua_config;

        if (Cache::has('api:eloqua:url')) {
            $base_url = Cache::get('api:eloqua:url');
        } else {
            $options = [
                'type' => $eloqua_config['user_credentials']['type'],
                'path' => $eloqua_config['user_credentials']['url'],
                'base_url' => $eloqua_config['auth']['base_url']
            ];

            $response = $this->call($options);
            $base_url = str_replace("{version}", $this->api_version, $response['urls']['apis']['rest']['standard']);
            Cache::add('api:eloqua:url', $base_url, Carbon::now()->addHours(1));
        }

        return $base_url;
    }

    /**
     * Call api request with options.
     *
     * @param Array $options
     *
     * @return Array response
     */
    private function call($options)
    {

        $client = $this->client;

        $params = (isset($options['params']))? $options['params'] : [];
        $params['headers'] = (isset($params['headers']))? $params['headers'] : [];

        if (!isset($params['auth'])) {
            $eloqua_token = "Bearer ".$this->getToken();
            $params['headers']["Authorization"] = $eloqua_token;
        }

        if (!isset($options['base_url'])) {
            $options['base_url'] = $this->getBaseUrl();
        }

        try {
            $response = $client->request($options['type'], $options['base_url'].$options['path'], $params);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $error = [
                'status' => 'error_request',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\ClientErrorResponseException $e) {
            $error = [
                'status' => 'error_client',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\ServerErrorResponseException $e) {
            $error = [
                'status' => 'error_server',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            $error = [
                'status' => 'error_response',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\ConnectException $e) {
            $error = [
                'status' => 'error_connect',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\Exception $e) {
            $error = [
                'status' => 'error',
                'code' => $e->getCode(),
                'data' => [
                    'reason' => $e->getMessage()
                ]
            ];
        }

        if (isset($error)) {
            if (!$this->flushed_cache) {
                Cache::forget('api:eloqua:url');
                Cache::forget('api:eloqua:token');
                $this->flushed_cache = true;
                return $this->call($options);
            } else {
                $error_message = (isset($error['data']['error_description']))
                    ? $error['data']['error_description'] : $error['status'];
                Activity::log(
                    'Error Eloqua ['.$error['status'].']',
                    array('properties' => ['message' => $error_message])
                );
                throw new \Exception($error_message);
            }
        } else {
            return json_decode($response->getBody()->getContents(), true);
        }
    }

    /**
     * Get email folder id
     *
     * @return Integer $forderId
     */
    private function getEmailFolderId()
    {

        $eloqua_config = $this->eloqua_config;

        $options = [
            'type' => $eloqua_config["list_folders"]["type"],
            'path' => $eloqua_config["list_folders"]["url"]
        ];

        $folders = $this->call($options);

        if (isset($folders["elements"])) {
            $folderId = null;
            $folders = $folders["elements"];

            for ($i = 0; $i < count($folders); $i++) {
                if (isset($eloqua_config["email_folder_name"]) && $eloqua_config["email_folder_name"] != "") {
                    if ($folders[$i]["name"] == $eloqua_config["email_folder_name"]) {
                        $folderId = $folders[$i]["id"];
                        break;
                    }
                } else {
                    if ($folders[$i]["isSystem"] === "true") {
                        $folderId = $folders[$i]["id"];
                        break;
                    }
                }
            }

            if (is_null($folderId)) {
                return (Int)$this->createEmailFolder($eloqua_config["email_folder_name"]);
            }

            return (Int)$folderId;
        }
    }

    /**
     * Create email folder
     *
     * @return Integer $forderId
     */
    public function createEmailFolder($name)
    {

        $eloqua_config = $this->eloqua_config;

        $options = [
            'type' => $eloqua_config["create_folder"]["type"],
            'path' => $eloqua_config["create_folder"]["url"],
            'params' => [
                'json' => [
                    'name' => $name
                ]
            ]
        ];

        $response = $this->call($options);

        if (isset($response["id"])) {
            return $response["id"];
        } else {
            return [ "error" => "folder_creation" ];
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
            $name = (is_null($request) || !isset($request['filename']))
                ? $campaign->campaign_name : $request['filename'];

            $versioning_name = Upload::versioningFilename($name);
            $eloqua_config = $this->eloqua_config;

            $options = [
                'type' => $eloqua_config["upload_email"]["type"],
                'path' => $eloqua_config["upload_email"]["url"],
                'params' => [
                    'json' => [
                        'name' => $versioning_name,
                        'folderId' => $this->getEmailFolderId(),
                        'htmlContent' => [
                            "type" => "RawHtmlContent",
                            "html" => $campaign->body_html
                        ],
                        'plainText' => $campaign->plain_text
                    ]
                ]
            ];

            $response = $this->call($options);

            if (isset($response["id"])) {
                Activity::log(
                    'Campaign uploaded to Eloqua',
                    [
                        'properties' => [
                            'campaign_id' => new ObjectID($campaign->id),
                            'filename' => $name,
                            'user_id' => new ObjectID(Auth::id())
                        ]
                    ]
                );

                Upload::create(
                    [
                        'api' => 'eloqua',
                        'campaign_id' => new ObjectID($campaign->id),
                        'original_filename' => $name,
                        'filename' => $versioning_name,
                        'user_id' => new ObjectID(Auth::id()),
                        'folder_id' => $response['folderId'],
                    ]
                );

                return [
                    'status' => 'success'
                ];
            }
        } else {
            throw new \Exception("campaign_missing");
        }
    }
}
