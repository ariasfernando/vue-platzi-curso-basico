<?php

namespace Stensul\Services\Api;

use GuzzleHttp\Client as Client;

class Responsys
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
}
