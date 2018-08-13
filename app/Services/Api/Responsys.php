<?php

namespace Stensul\Services\Api;

use Auth;
use Activity;
use UploadModel as Upload;
use GuzzleHttp\Client as Client;
use MongoDB\BSON\ObjectID as ObjectID;

class Responsys implements ApiConnector
{
    private $library_name = '';
    private $auth;
    private $campaign;

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
        if ($method === 'auth' && array_key_exists($this->library_name, \Config::get('api.responsys.libraries'))) {
            $params = array_merge(\Config::get('api.responsys.libraries.' . $this->library_name . '.auth'), $settings);
        } else {
            $params = array_merge(\Config::get("api.responsys.".$method), $settings);
        }
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
        if ($campaign->library) {
            $this->library_name = $campaign->library;
        } elseif (array_key_exists('library_name', $request)) {
            $this->library_name = $request['library_name'];
        }
        if (!is_null($campaign)) {
            $this->campaign = $campaign;
            $original_filename = (is_null($request) || !isset($request['filename']))
                ? $campaign->campaign_name : $request['filename'];
            $original_filename = str_replace(' ', '_', $original_filename);
            if (strlen($original_filename)) {
                $this->auth = $this->call('auth');
                if (isset($this->auth['data']['endPoint']) && isset($this->auth['data']['authToken'])) {
                    $path = \Config::get(
                        'api.responsys.libraries.' . $this->library_name . '.default_path',
                        \Config::get('api.responsys.default_path')
                    );
                    $previous = Upload::fileExists($original_filename);

                    // Check if the user wants to overwrite the file if this exists
                    if (isset($request['overwrite_file']) && $request['overwrite_file'] == 'on' && count($previous)) {
                        $filename = str_replace(['.html', '.htm'], '', $original_filename)  . '.htm';

                        // Delete document
                        $resp_delete = $this->deleteDoc($path . $filename);
                        if ($resp_delete['status'] == 'success') {
                            Activity::log(
                                'Document deleted from Responsys',
                                [
                                    'properties' => [
                                        'campaign_id' => new \ObjectID($this->campaign->id),
                                        'filename' => $filename,
                                        'user_id' => new \ObjectID(Auth::id())
                                    ]
                                ]
                            );
                        }
                    } else {
                        $filename = Upload::versioningFilename($original_filename);
                    }

                    // Create document
                    $resp_create = $this->createDoc($path . $filename);

                    if ($resp_create['status'] == 'success') {
                        Activity::log(
                            'Campaign uploaded to Responsys',
                            [
                                'properties' => [
                                    'campaign_id' => new ObjectID($this->campaign->id),
                                    'filename' => $filename,
                                    'user_id' => new ObjectID(Auth::id())
                                ]
                            ]
                        );

                        Upload::create(
                            [
                                'api' => 'responsys',
                                'campaign_id' => new ObjectID($this->campaign->id),
                                'original_filename' => $original_filename,
                                'filename' => $filename,
                                'path' => $path,
                                'user_id' => new ObjectID(Auth::id())
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

    /**
     * Create document
     *
     * @param string $document_path
     *
     * @return array $response
     */
    private function createDoc($document_path)
    {
        $resp = $this->call(
            'create_doc',
            [
                'config' => [
                    'base_uri' => $this->auth['data']['endPoint']
                ],
                'options' => [
                    'headers' => [
                        'Authorization' => $this->auth['data']['authToken']
                    ],
                    'json' => [
                        "documentPath" => $document_path,
                        "content" => $this->campaign->body_html
                    ]
                ]
            ]
        );
        return $resp;
    }

    /**
     * Delete document
     *
     * @param string $document_path
     *
     * @return array $response
     */
    private function deleteDoc($document_path)
    {
        $resp = $this->call(
            'delete_doc',
            [
                'config' => [
                    'base_uri' => $this->auth['data']['endPoint']
                ],
                'options' => [
                    'headers' => [
                        'Authorization' => $this->auth['data']['authToken']
                    ],
                    'json' => []
                ],
                'url' => \Config::get('api.responsys.delete_doc.url') . $document_path
            ]
        );
        return $resp;
    }
}
