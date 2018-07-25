<?php

namespace Stensul\Services\Api;

use Auth;
use Activity;
use UploadModel as Upload;
use GuzzleHttp\Client as Client;
use MongoDB\BSON\ObjectID as ObjectID;

class Yesmail implements ApiConnector
{
    private $client;
    private $yesmail_config;

    /**
     * Yesmail constructor.
     *
     */
    public function __construct()
    {
        $this->client = new Client();
        $this->yesmail_config = \Config::get("api.yesmail");
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
            $original_filename = (is_null($request) || !isset($request['filename']))
                ? $campaign->campaign_name : $request['filename'];
            if (strlen($original_filename)) {
                $campaign_id = $request['campaign_id'];
                $filename = Upload::versioningFilename($original_filename);
                $credentials = $this->yesmail_config['credentials'];
                $config = $this->yesmail_config['upload_email'];
                $path = $this->yesmail_config['base_url'] . $config['url'];
                $resp = $this->call($config['type'], $path, [
                    'headers' => [
                        'Api-Key' => $credentials['api_key'],
                        'Api-User' => $credentials['company']
                    ],
                    'json' => [
                        'name' => $filename,
                        'body' => [
                            [
                                'html' => $campaign->body_html,
                                'text' => $campaign->plain_text
                            ]
                        ]
                    ]
                ]);
                if (isset($resp['id'])) {
                    Activity::log('Campaign uploaded to Yesmail', [
                        'properties' => [
                            'campaign_id' => new ObjectId($campaign_id),
                            'filename' => $filename,
                            'user_id' => new ObjectId(Auth::id())
                        ]
                    ]);

                    Upload::create([
                        'api' => 'yesmail',
                        'campaign_id' => new ObjectId($campaign_id),
                        'original_filename' => $original_filename,
                        'filename' => $filename,
                        'path' => $path,
                        'user_id' => new ObjectId(Auth::id())
                    ]);

                    return [
                        'status' => 'success'
                    ];
                } else {
                    throw new \Exception("Unable to confirm Yesmail received the file.");
                }
            }
        } else {
            throw new \Exception("campaign_missing");
        }
    }

    /**
     * Make a call to Yesmail api.
     *
     * @param Array $options
     *
     * @return Array response
     */
    public function call($type, $uri, $options)
    {
        $client = $this->client;

        try {
            $response = $client->request($type, $uri, $options);
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
            $error_message = isset($error['data']['message']) ? $error['data']['message'] : $error['status'];
            Activity::log(
                'Error Yesmail ['.$error['status'].']',
                array('properties' => $error)
            );
            throw new \Exception($error_message);
        } else {
            return json_decode($response->getBody()->getContents(), true);
        }
    }
}
