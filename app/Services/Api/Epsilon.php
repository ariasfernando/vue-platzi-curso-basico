<?php

namespace Stensul\Services\Api;

use Auth;
use Cache;
use Session;
use Activity;
use Carbon\Carbon;
use UploadModel as Upload;
use GuzzleHttp\Client as Client;
use MongoDB\BSON\ObjectID as ObjectID;

class Epsilon implements ApiConnector
{
    private $client;
    private $epsilon_config;
    private $flushed_cache = false;
    private $access_token = null;

    /**
     * Epsilon constructor.
     *
     */
    public function __construct()
    {
        $this->client = new Client();
        $this->epsilon_config = \Config::get("api.epsilon");
    }

    /**
     * Get epsilon token.
     *
     * @param  Array   $params
     * @param  Boolean $force
     * @return String  access_token
     */
    private function getToken($force = false)
    {
        if (!is_null($this->access_token)) {
            return $this->access_token;
        }

        $epsilon_config = $this->epsilon_config;

        if (!$force && Cache::has('api:epsilon:token')) {
            $epsilon_token = Cache::get('api:epsilon:token');
        } else {
            $options = [
                'base_url' => $epsilon_config['auth']['base_url'],
                'path' => $epsilon_config['auth']['path'],
                'type' => 'POST',
                'params' => [
                    'headers' => [
                        "Authorization" => 'Basic ' . $this->getBaseToken()
                    ],
                    'form_params' => [
                        'scope' => 'cn mail sn givenname uid employeeNumber',
                        'grant_type' => 'password',
                        'username' => $epsilon_config['auth']['credentials']['user_name'],
                        'password' => $epsilon_config['auth']['credentials']['password'],
                    ]
                ]
            ];
            $response = $this->call($options);
            $epsilon_token = $response['access_token'];
            Cache::add('api:epsilon:token', $epsilon_token, now()->addSeconds($response['expires_in'])); 
        }

        return $epsilon_token;
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

        $params = $options['params'] ?? [];
        $params['headers'] = $params['headers'] ?? [];

        try {
            if (!isset($params['form_params']['username']) && !isset($params['form_params']['password'])) {
                $epsilon_token = "Bearer " . $this->getToken();
                $params['headers']["Authorization"] = $epsilon_token;
            }
            $response = $client->request($options['type'], $options['base_url'] . $options['path'], $params);
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
            if ($this->flushed_cache) {
                $error_message = isset($error['data']['resultCode']) && isset($error['data']['resultString'])
                    ? $error['data']['resultCode'] . " - " .$error['data']['resultString']
                    : $error['status'];
    
                Activity::log('Error Epsilon [' . $error['status'] . ']', [
                    'properties' => [
                        'message' => $error_message
                    ]
                ]);
    
                \Log::error(json_encode($error));
    
                throw new \Exception($error_message);
            }

            Cache::forget('api:epsilon:token');
            $this->flushed_cache = true;

            return $this->call($options);
        }
        
        return json_decode($response->getBody()->getContents(), true);
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
        if (is_null($campaign)) {
            throw new \Exception('campaign_missing');
        }

        $campaign_id = new ObjectId($campaign->id);
        $epsilon_config = $this->epsilon_config;

        $force = (isset($request['force']) && $request['force'] === true)
            ? true : false;

        $name = (is_null($request) || !isset($request['filename']))
            ? $campaign->campaign_name : $request['filename'];

        if (isset($request['subject'])) {
            $subject = $request['subject'];
        } elseif (isset($campaign['subject_line'])) {
            $subject = $campaign['subject_line'];
        } else {
            $subject = '';
        }

        $request_type = 'POST';
        $api_path = $epsilon_config['upload_path'];

        $request_body = [
            'name' => $name,
            'description' => $subject,
            'type' => "CONTENT_BLOCK",
            'subType' => "HTML",
            'content' => [
                'characterSet' => "UTF_8",
                'contentType' => "HTML",
                'content' => $campaign->body_html,
            ]
        ];

        $content_id = isset($request['content_id']) ? $request['content_id'] : $epsilon_config['content_id'];

        if (!empty($content_id)) {
            $content = $this->getContentById($content_id);

            $request_type = 'PUT';
            $api_path .= '/' . $content_id;
            $request_body['id'] = $content_id;
            $request_body['modifiedDate'] = $content['data']['modifiedDate'];
            $request_body['content']['id'] = $content_id;
            $request_body['content']['modifiedDate'] = $content['data']['modifiedDate'];
            $request_body['parentId'] = $content['data']['parentId'];

        } else {
            if (isset($epsilon_config['folder'])) {
                $request_body['parentId'] = $epsilon_config['folder'];
            }

            $last_upload = Upload::lastUploadByCampaign($campaign_id);

            // Update html content if there is a previous one
            if (!$force && $last_upload && isset($last_upload['properties']['id']) 
                && isset($last_upload['properties']['modifiedDate'])) {
                $content_id = $last_upload['properties']['id'];
                $modified_date = $last_upload['properties']['modifiedDate'];
                $request_type = 'PUT';
                $api_path .= '/' . $content_id;
                $request_body['id'] = $content_id;
                $request_body['modifiedDate'] = $modified_date;
                $request_body['content']['id'] = $content_id;
                $request_body['content']['modifiedDate'] = $modified_date;
            }
        }

        $api_path .= '?applyLinks=true';  

        $options = [
            'base_url' => $epsilon_config['api_url'],
            'path' => $api_path,
            'type' => $request_type,
            'params' => [
                'headers' => [
                    "Content-Type" =>  "application/json",
                    "Accept"  => "application/json",
                    "X-OUID" => $epsilon_config['x-ouid'],
                ],
                'body' => json_encode($request_body)
            ]
        ];

        $response = $this->call($options);

        if (isset($response['data']['id']) && isset($response['data']['modifiedDate'])) {
            Activity::log('Campaign uploaded to Epsilon', [
                'properties' => [
                    'campaign_id' => $campaign_id,
                    'filename' => $name,
                    'user_id' => new ObjectId(Auth::id())
                ]
            ]);

            Upload::create([
                'api' => 'epsilon',
                'campaign_id' => $campaign_id,
                'original_filename' => $name,
                'filename' => $name,
                'user_id' => new ObjectId(Auth::id()),
                'folder_id' => $epsilon_config['folder'],
                'properties' => [
                    "id" => $response['data']['id'],
                    "modifiedDate" => $response['data']['modifiedDate']
                ]
            ]);

            return [
                'status' => 'success'
            ];
        }
        
        return $response;
    }

    /**
    * Concatenate the client id and secret key.
    *
    * @return mixed
    *   Returns encoded Base64 value.
    */
    protected function getBaseToken() {
        $epsilon_config = $this->epsilon_config;

        if (isset($epsilon_config['auth']['credentials']['base_token'])) {
            $base64_token = $epsilon_config['auth']['credentials']['base_token'];
        } else {
            $base64_token = base64_encode($epsilon_config['auth']['credentials']['client_id'] . ":" . $epsilon_config['auth']['credentials']['client_secret']);
        }

        return $base64_token;
    }

    /**
    * Get content by content id
    *
    * @param String $content_id
    *
    * @return Array content
    *
    */
    public function getContentById($content_id = null) {
        $epsilon_config = $this->epsilon_config;

        if (!$content_id) {
            throw new \Exception('content_id_missing');
        }

        $api_path = $epsilon_config['upload_path'] . '/' . $content_id;

        $options = [
            'base_url' => $epsilon_config['auth']['base_url'],
            'path' => $api_path,
            'type' => 'GET',
            'params' => [
                'headers' => [
                    "Content-Type" =>  "application/json",
                    "X-OUID" => $epsilon_config['x-ouid'],
                ],
            ]
        ];

        return $this->call($options);
    }
}
