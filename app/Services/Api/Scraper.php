<?php

namespace Stensul\Services\Api;

use Carbon\Carbon;
use GuzzleHttp\Client as Client;

class Scraper
{
    /**
     * Call api request with options.
     *
     * @param Array $options
     *
     * @return Array response
     */
    protected function call($options)
    {
        $client = new Client();
        $params = (isset($options['params']))? $options['params'] : [];
        $options['type'] = (isset($options['type']))? $options['type'] : 'GET';
        $params['headers'] = ['Accept-Encoding' => 'gzip'];

        try {
            $response = $client->request($options['type'], $options['path'], $params);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $error = [
                'status' => 'error_request',
                'code' => $e->getResponse() ? $e->getResponse()->getStatusCode() : '',
                'data' => $e->getResponse() ? json_decode($e->getResponse()->getBody()->getContents(), true) : $e->getMessage()
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

        return (!isset($error))? $response->getBody()->getContents() : false;
    }

    /**
     * Pagination
     *
     * @param Array $data
     * @param Integer $page
     * @param Integer $limit
     *
     * @return Integer $forderId
     */
    protected function paginationConstructor($data, $page, $limit)
    {
        $page = ($page < 1)? 1 : $page;
        $start = ($page - 1) * $limit;
        return ($limit > 0)? array_slice($data, $start, $limit) : $data;
    }

    /**
     * Formatted Carbon date
     *
     * @param integer $timestamp
     *
     * @return string
     */
    protected function formattedDate($timestamp = null)
    {
        $timestamp = (is_null($timestamp))? time() : $timestamp;
        return Carbon::createFromTimestamp($timestamp)->format("m/d/Y h:i a T");
    }
}
