<?php

namespace Stensul\Services\Api;

use Auth;
use Cache;
use Activity;
use Carbon\Carbon;
use Stensul\Models\Upload;
use GuzzleHttp\Client as Client;
use MongoDB\BSON\ObjectID as ObjectID;

class Marketo implements ApiConnector
{
    protected $marketo_config;
    protected $access_token = null;

    public function __construct()
    {
        $this->marketo_config = \Config::get('api.marketo');
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
                // get token
                if ($this->access_token = $this->getToken()) {
                    $campaign_id = $request['campaign_id'];
                    // get folder
                    if ($folder = $this->getFolder()) {
                        if (isset($folder['folderType']) && $folder['folderType'] === 'Email Template') {
                            $filename = Upload::versioningFilename($original_filename);
                            $resp = $this->call('upload_email', [
                                'url' => $this->marketo_config['api_path']
                                    . $this->marketo_config['upload_email']['url'],
                                'config' => [],
                                'options' => [
                                    'headers' => [
                                        'Authorization' =>  'Bearer ' . $this->access_token
                                    ],
                                    'multipart' => [
                                        [
                                            'name' => 'name',
                                            'contents' => $original_filename
                                        ],
                                        [
                                            'name' => 'content',
                                            'contents' => $campaign->body_html,
                                            'filename' => $filename
                                        ],
                                        [
                                            'name' => 'folder',
                                            'contents' => json_encode($folder['folderId'])
                                        ]
                                    ]
                                ]
                            ]);

                            if (isset($resp['status']) && $resp['status'] === 'success' && $resp['data']['success']) {
                                Activity::log(
                                    'Campaign uploaded to Marketo',
                                    [
                                        'properties' => [
                                            'campaign_id' => new ObjectId($campaign_id),
                                            'filename' => $filename,
                                            'user_id' => new ObjectId(Auth::id())
                                        ]
                                    ]
                                );

                                Upload::create([
                                    'api' => 'marketo',
                                    'campaign_id' => new ObjectId($campaign_id),
                                    'original_filename' => $original_filename,
                                    'filename' => $filename,
                                    'path' => $folder['folderId']['id'],
                                    'user_id' => new ObjectId(Auth::id())
                                ]);

                                return [
                                    'status' => 'success'
                                ];
                            } else {
                                if (isset($resp['data']['errors']) && isset($resp['data']['errors']['code'])) {
                                    $error = 'Marketo error: (' . $resp['data']['errors']['code'] . ') '
                                        . $resp['data']['errors']['message'];
                                    \Log::error($error);
                                }
                                throw new \Exception("Unable to confirm Marketo received the file.");
                            }
                        } else {
                            throw new \Exception("Given folder is not suitable for templates.");
                        }
                    }
                } else {
                }
            }
        } else {
            throw new \Exception("campaign_missing");
        }
    }

    /**
     * Get Marketo token.
     *
     * @return String access_token
     */
    private function getToken()
    {
        $key = 'api:marketo:token';

        if (Cache::has($key)) {
            $marketo_token = Cache::get($key);
        } else {
            $auth_call = [
                'url' => $this->marketo_config['api_path']
                    . $this->marketo_config['auth']['url']
                    . '?'
                    . http_build_query($this->marketo_config['auth']['credentials']),
                'config' => [],
                'options' => []
            ];

            $resp = $this->call('auth', $auth_call);

            if (isset($resp['status']) && $resp['status'] === 'success') {
                $marketo_token = $resp['data']['access_token'];
                Cache::add($key, $marketo_token, Carbon::now()->addMinutes(10));
            }
        }

        return isset($marketo_token) ? $marketo_token : false;
    }

    /**
     * Get one Marketo folder by a given name.
     *
     * @return array|null
     */
    private function getFolderByName()
    {
        $folder = null;
        $folder_config = $this->marketo_config['folder_by_name'];
        $key = 'api:marketo:folder:' . strtolower($folder_config['params']['name']);

        if (Cache::has($key)) {
            $folder = Cache::get($key);
        } else {
            $folder_params = [
                'url' => $this->marketo_config['api_path']
                    . $folder_config['url']
                    . '?'
                    . http_build_query($folder_config['params']),
                'config' => [],
                'options' => [
                    'headers' => [
                        'accept' => 'application/json',
                        'Authorization' => 'Bearer ' . $this->access_token
                    ]
                ],
            ];
            $resp = $this->call('folder', $folder_params);

            if (isset($resp['status']) && $resp['status'] === 'success') {
                $folder = array_shift($resp['data']['result']);
                Cache::add($key, $folder, Carbon::now()->addHour());
            }
        }

        return $folder;
    }

    /**
     * Get Marketo folder data.
     *
     * @return array|null
     */
    private function getFolder($folder_id = null)
    {
        $folder = [];
        $folder_config = $this->marketo_config['folder'];

        if (is_null($folder_id)) {
            $folder_id = $folder_config['id'];
        }

        if ($folder_id) {
            $key = 'api:marketo:folder:' . $folder_id;

            if (Cache::has($key)) {
                $folder = Cache::get($key);
            } else {
                $resp = $this->call('folder', [
                    'url' => $this->marketo_config['api_path']
                        . sprintf($folder_config['url'], $folder_id),
                    'config' => [],
                    'options' => [
                        'headers' => [
                            'accept' => 'application/json',
                            'Authorization' => 'Bearer ' . $this->access_token
                        ]
                    ],
                ]);

                if (isset($resp['status']) && $resp['status'] === 'success') {
                    $folder = array_shift($resp['data']['result']);
                    Cache::add($key, $folder, Carbon::now()->addHour());
                }
            }
        }

        return $folder;
    }

    /**
     * Get Marketo list of folder.
     *
     * @return array|null
     */
    private function getFolderList()
    {
        $folder = null;
        $folder_config = $this->marketo_config['list_folders'];

        $folder_params = [
            'url' => $this->marketo_config['api_path']
                . $folder_config['url'],
            'config' => [],
            'options' => [
                'headers' => [
                    'accept' => 'application/json',
                    'Authorization' => 'Bearer ' . $this->access_token
                ]
            ]
        ];
        $resp = $this->call('list_folders', $folder_params);

        if (isset($resp['status']) && $resp['status'] === 'success') {
            $folder = array_shift($resp['data']['result']);
        }

        return $folder;
    }

    /**
     * Make a call to Marketo api.
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
        $params = array_merge(\Config::get("api.marketo." . $method), $settings);
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
                    'Api call fails. Error: (' . $response->getStatusCode() . ') ' . $response->getMessage()
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
}
