<?php

namespace Stensul\Services\Api;

use Auth;
use Cache;
use Session;
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
    private $library_name = '';

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

        if ($eloqua_config['use_oauth']) {
            return $this->getTokenByOauth();
        }
        if (Cache::has('api:eloqua:' . $this->library_name . ':token')) {
            $eloqua_token = Cache::get('api:eloqua:' . $this->library_name . ':token');
        } elseif (Cache::has('api:eloqua:token')) {
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
                        'grant_type' => 'password',
                        'scope'      => 'full',
                        'password'   => $eloqua_config['auth']['credentials']['password'],
                        'username'   => $eloqua_config['auth']['credentials']['company_name']. "\\"
                            .$eloqua_config['auth']['credentials']['user_name']
                    ],
                ]
            ];
            if (!empty($eloqua_config['libraries'][$this->library_name]['auth'])) {
                $options['base_url'] = $eloqua_config['libraries'][$this->library_name]['auth']['base_url'];
                $options['path'] = $eloqua_config['libraries'][$this->library_name]['auth']['path'];
                $options['type'] = $eloqua_config['libraries'][$this->library_name]['auth']['type'];
                $options['params']['auth'] = [
                    $eloqua_config['libraries'][$this->library_name]['auth']['credentials']['client_id'],
                    $eloqua_config['libraries'][$this->library_name]['auth']['credentials']['client_secret']
                ];
                $options['params']['json']['password'] = $eloqua_config['libraries'][$this->library_name]['auth']['credentials']['password'];
                $options['params']['json']['username'] =  $eloqua_config['libraries'][$this->library_name]['auth']['auth']['credentials']['company_name'] . "\\"
                    . $eloqua_config['auth']['credentials']['user_name'];
            }

            $response = $this->call($options);
            $credentials = $response;
            $eloqua_token = $credentials['access_token'];
            if (array_key_exists($this->library_name, $this->eloqua_config['libraries'])) {
                Cache::add('api:eloqua:' . $this->library_name . ':token', Carbon::now()->addHours(1));
            } else {
                Cache::add('api:eloqua:token', $eloqua_token, Carbon::now()->addHours(1));
            }
        }

        return $eloqua_token;
    }

    /**
     * Get eloqua token by oauth.
     *
     * @param  Array   $params
     * @param  Boolean $force
     * @return String  access_token
     */
    private function getTokenByOauth($params = [], $force = false)
    {
        if (Session::has('api:eloqua:token:expires_in') && Session::get('api:eloqua:token:expires_in') >= strtotime('now')) {
            $force = true;
        }

        if (!$force && Session::has('api:eloqua:token')) {
            return Session::get('api:eloqua:token');
        }

        $eloqua_config = $this->eloqua_config;

        $options = [
            'base_url' => $eloqua_config['auth']['base_url'],
            'path' => $eloqua_config['auth']['path'],
            'type' => $eloqua_config['auth']['type']
        ];

        if (Session::has('api:eloqua:refresh')) {
            $options['params'] = [
                'auth' => [],
                'headers' => [
                    "Authorization" => [
                        'Basic ' . base64_encode(
                            $eloqua_config['auth']['credentials']['client_id']
                            . ':'
                            . $eloqua_config['auth']['credentials']['client_secret']
                        )
                    ]
                ],
                'json' => [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => Session::get('api:eloqua:refresh'),
                    'scope' => 'full',
                    'redirect_uri' => $eloqua_config['oauth']['credentials']['redirect_uri']
                ]
            ];
        } else {
            $options['params'] = [
                'auth' => [
                    $eloqua_config['auth']['credentials']['client_id'],
                    $eloqua_config['auth']['credentials']['client_secret']
                ],
                'json' => [
                    "grant_type" => 'password',
                    'scope'      => 'full',
                    'password'   => $eloqua_config['auth']['credentials']['password'],
                    "username"   => $eloqua_config['auth']['credentials']['company_name']. "\\"
                        .$eloqua_config['auth']['credentials']['user_name']
                ],
            ];
        }

        $options['params'] = array_merge($options['params'], $params);

        $response = $this->call($options);
        $credentials = $response;
        $eloqua_token = $credentials['access_token'];

        Session::put('api:eloqua:token', $eloqua_token);
        Session::put('api:eloqua:expires_in', strtotime('now') + $credentials['expires_in']);
        Session::put('api:eloqua:refresh', $credentials['refresh_token']);

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
        if ($eloqua_config['use_oauth']) {
            return $this->getBaseUrlByOauth();
        }
        if (Cache::has('api:eloqua:' . $this->library_name . ':url')) {
            $base_url = Cache::get('api:eloqua:' . $this->library_name . ':url');
        } elseif (Cache::has('api:eloqua:url')) {
            $base_url = Cache::get('api:eloqua:url');
        } else {
            $options = [
                'type' => $eloqua_config['user_credentials']['type'],
                'path' => $eloqua_config['user_credentials']['url'],
                'base_url' => $eloqua_config['auth']['base_url']
            ];
            if (array_key_exists($this->library_name, $this->eloqua_config['libraries'])) {
                $options['base_url'] = $eloqua_config['libraries'][$this->library_name]['auth']['base_url'];
            }
            $response = $this->call($options);
            $base_url = str_replace("{version}", $this->api_version, $response['urls']['apis']['rest']['standard']);
            if (array_key_exists($this->library_name, $this->eloqua_config['libraries'])) {
                Cache::add('api:eloqua:' . $this->library_name . ':url', Carbon::now()->addHours(1));
            } else {
                Cache::add('api:eloqua:url', $base_url, Carbon::now()->addHours(1));
            }
        }

        return $base_url;
    }

    /**
     * Get base url for api connection.
     *
     * @return String base_url
     */
    private function getBaseUrlByOauth()
    {
        $eloqua_config = $this->eloqua_config;

        if (Session::has('api:eloqua:url')
            && Session::has('api:eloqua:url:expires_in')
            && Session::get('api:eloqua:url:expires_in') >= strtotime('now')) {
            $base_url = Session::get('api:eloqua:url');
        } else {
            $options = [
                'type' => $eloqua_config['user_credentials']['type'],
                'path' => $eloqua_config['user_credentials']['url'],
                'base_url' => $eloqua_config['auth']['base_url']
            ];

            $response = $this->call($options);
            $base_url = str_replace("{version}", $this->api_version, $response['urls']['apis']['rest']['standard']);
            Session::put('api:eloqua:url', $base_url);
            Session::put('api:eloqua:url:expires_in', Carbon::now()->addHours(1));
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

        try {
            if (!isset($params['auth'])) {
                $eloqua_token = "Bearer ".$this->getToken();
                $params['headers']["Authorization"] = $eloqua_token;
            }

            if (!isset($options['base_url'])) {
                $options['base_url'] = $this->getBaseUrl();
            }

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
                Cache::forget('api:eloqua:' . $this->library_name . ':url');
                Cache::forget('api:eloqua:' . $this->library_name . ':token');


                Session::forget('api:eloqua:url');
                Session::forget('api:eloqua:url:expires_in');
                Session::forget('api:eloqua:token');
                Session::forget('api:eloqua:token:expires_in');
                Session::forget('api:eloqua:refresh');
                $this->flushed_cache = true;
                return $this->call($options);
            } else {
                $error_message = isset($error['data']['error_description'])
                    ? $error['data']['error_description']
                    : $error['status'];

                Activity::log('Error Eloqua [' . $error['status'] . ']', [
                    'properties' => [
                        'message' => $error_message
                    ]
                ]);

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
            'type' => $eloqua_config['list_folders']['type'],
            'path' => $eloqua_config['list_folders']['url']
        ];

        $folders = $this->call($options);

        if (isset($folders['elements'])) {
            $folderId = null;
            $folders = $folders['elements'];

            for ($i = 0; $i < count($folders); $i++) {
                if (!empty($eloqua_config['libraries'][$this->library_name]['email_folder_name'])) {
                    if ($folders[$i]['name'] == $eloqua_config['libraries'][$this->library_name]['email_folder_name']) {
                        $folderId = $folders[$i]['id'];
                        break;
                    }
                } elseif (!empty($eloqua_config['email_folder_name'])) {
                    if ($folders[$i]['name'] == $eloqua_config['email_folder_name']) {
                        $folderId = $folders[$i]['id'];
                        break;
                    }
                } elseif ($folders[$i]['isSystem'] === 'true') {
                    $folderId = $folders[$i]['id'];
                    break;
                }
            }

            if (is_null($folderId)) {
                if (!empty($eloqua_config['libraries'][$this->library_name]['email_folder_name'])) {
                    return (Int)$this->createEmailFolder($eloqua_config['libraries'][$this->library_name]['email_folder_name']);
                }
                return (Int)$this->createEmailFolder($eloqua_config['email_folder_name']);
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
            'type' => $eloqua_config['create_folder']['type'],
            'path' => $eloqua_config['create_folder']['url'],
            'params' => [
                'json' => [
                    'name' => $name
                ]
            ]
        ];

        $response = $this->call($options);

        if (isset($response['id'])) {
            return $response['id'];
        } else {
            return [ 'error' => 'folder_creation' ];
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
            if ($campaign->library) {
                $this->library_name = $campaign->library;
            } elseif(!empty($request['library_name'])) {
                $this->library_name = $request['library_name'];
            }
            $name = (is_null($request) || !isset($request['filename']))
                ? $campaign->campaign_name : $request['filename'];

            $versioning_name = Upload::versioningFilename($name);

            if (isset($request['subject'])) {
                $subject = $request['subject'];
            } elseif (isset($campaign['subject_line'])) {
                $subject = $campaign['subject_line'];
            } else {
                $subject = '';
            }

            $eloqua_config = $this->eloqua_config;

            $options = [
                'type' => $eloqua_config['upload_email']['type'],
                'path' => $eloqua_config['upload_email']['url'],
                'params' => [
                    'json' => [
                        'name' => $versioning_name,
                        'folderId' => $this->getEmailFolderId(),
                        'subject' => $subject,
                        'htmlContent' => [
                            'type' => 'RawHtmlContent',
                            'html' => $campaign->body_html
                        ],
                        "isPlainTextEditable" => true,
                        "sendPlainTextOnly" => true,
                        'plainText' => $campaign->plain_text
                    ]
                ]
            ];

            $response = $this->call($options);

            if (isset($response["id"])) {
                Activity::log('Campaign uploaded to Eloqua', [
                    'properties' => [
                        'campaign_id' => new ObjectId($campaign->id),
                        'filename' => $name,
                        'user_id' => new ObjectId(Auth::id())
                    ]
                ]);

                Upload::create([
                    'api' => 'eloqua',
                    'campaign_id' => new ObjectId($campaign->id),
                    'original_filename' => $name,
                    'filename' => $versioning_name,
                    'user_id' => new ObjectId(Auth::id()),
                    'folder_id' => $response['folderId'],
                ]);

                return [
                    'status' => 'success'
                ];
            } else {
                return $response;
            }
        } else {
            throw new \Exception('campaign_missing');
        }
    }

    /**
     * Oauth call to Eloqua
     *
     * @param  \Illuminate\Http\Request $request
     * @return Redirect or View
     */
    public function oauth($request)
    {
        if ($request->session()->has('api:eloqua:token')
            && $request->session()->has('api:eloqua:token:expires_in')
            && $request->session()->get('api:eloqua:token:expires_in') >= strtotime('now')) {
            $access_token = $request->session()->pull('api:eloqua:token');
        } else {
            $eloqua_config = $this->eloqua_config;
            if ($code = $request->input('code')) {
                $access_token = $this->getTokenByOauth([
                    'auth' => [],
                    'headers' => [
                        "Authorization" => [
                            'Basic ' . base64_encode(
                                $eloqua_config['auth']['credentials']['client_id']
                                . ':'
                                . $eloqua_config['auth']['credentials']['client_secret']
                            )
                        ]
                    ],
                    'json' => [
                        'grant_type' => 'authorization_code',
                        'code' => $code,
                        'redirect_uri' => $eloqua_config['oauth']['credentials']['redirect_uri']
                    ]
                ], true);
            } else {
                $url = $eloqua_config['oauth']['base_url'] . $eloqua_config['oauth']['path'];
                $url.= '?' . http_build_query($eloqua_config['oauth']['credentials']);
                return redirect()->away($url);
            }
        }
        return view('base.auth.api_oauth')->with('data', json_encode([
            'access_token' => $access_token
        ]));
    }
}
