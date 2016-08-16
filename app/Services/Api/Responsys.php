<?php

namespace Stensul\Services\Api;

use Auth;
use Activity;
use Stensul\Models\Upload;
use GuzzleHttp\Client as Client;

class Responsys implements ApiConnector
{
    /**
     * Make a call to Responsys api.
     *
     * @param string   $method
     * @param array    $settings (optional)
     * @param callable $callback (optional)
     *
     * @return array | callback
     */
    public function call($method, $settings = [], $callback = null)
    {
        $resp = [];
        $params = array_merge(\Config::get("api.responsys.".$method), $settings);
        try {
            $client = new Client($params['config']);

            $response = $client->request($params['type'], $params['url'], $params['options']);

            if (in_array($response->getStatusCode(), [200, 201])) {
                $resp = [
                    'status' => 'success',
                    'code' => $response->getStatusCode(),
                    'data' => json_decode($response->getBody()->getContents(), true)
                ];
            } else {
                throw new \Exception(
                    'Api call fails. Error: ('.$response->getStatusCode().') '.$response->getMessage()
                );
            }
        } catch (\GuzzleHttp\Exception\ClientErrorResponseException $e) {
            $resp = [
                'status' => 'error',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\ServerErrorResponseException $e) {
            $resp = [
                'status' => 'error',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            $resp = [
                'status' => 'error',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\Exception $e) {
            $resp = [
                'status' => 'error',
                'code' => $e->getCode(),
                'data' => [
                    'reason' => $e->getMessage()
                ]
            ];
        }
        return is_callable($callback) ? $callback($resp) : $resp;
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
            $original_filename = (is_null($request) || !isset($request['filename']))? $campaign->campaign_name : $request['filename'];
            if (strlen($original_filename)) {
                $campaign_id = $request['campaign_id'];
                $filename = Upload::versioningFilename($original_filename);
                $auth = $this->call('auth');
                if (isset($auth['data']['endPoint']) && isset($auth['data']['authToken'])) {
                    $path = \Config::get('api.responsys.default_path');
                    $resp = $this->call(
                        'create_doc',
                        [
                            'config' => [
                                'base_uri' => $auth['data']['endPoint']
                            ],
                            'options' => [
                                'headers' => [
                                    'Authorization' => $auth['data']['authToken']
                                ],
                                'json' => [
                                    "documentPath" => $path . $filename,
                                    "content" => $campaign->body_html
                                ]
                            ]
                        ]
                    );
                    if ($resp['status'] == 'success') {
                        Activity::log(
                            'Campaign uploaded to Responsys',
                            [
                                'properties' => [
                                    'campaign_id' => new \MongoId($campaign_id),
                                    'filename' => $filename,
                                    'user_id' => new \MongoId(Auth::id())
                                ]
                            ]
                        );

                        Upload::create(
                            [
                                'api' => 'responsys',
                                'campaign_id' => new \MongoId($campaign_id),
                                'original_filename' => $original_filename,
                                'filename' => $filename,
                                'path' => $path,
                                'user_id' => new \MongoId(Auth::id())
                            ]
                        );

                        return [
                            'status' => 'success'
                        ];

                    } else {
                        throw new \Exception("Unable to confirm Responsys received the file.");
                    }
                } else {
                    throw new \Exception("Unable to connect to Responsys.");
                }
            }
        } else {
            throw new \Exception("campaign_missing");
        }
    }
}
