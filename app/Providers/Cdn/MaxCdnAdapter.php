<?php

namespace Stensul\Providers\Cdn;

use MaxCDN;
use Log;

class MaxCdnAdapter implements CdnInterface
{
    protected $config;
    protected $client;

    /**
     * Constructor.
     *
     * @param array $config
     */
    public function __construct($config)
    {
        $this->config = $config;
        $this->client = new MaxCDN($config['alias'], $config['key'], $config['secret']);
    }

    /**
     * Flush.
     */
    public function flush()
    {
    }

    /**
     * Delete files.
     *
     * @param mixed $files Array with files or string with a single file.
     *
     * @see \Stensul\Providers\Cdn\CdnInterface::delete()
     *
     * @throws \Exception
     *
     * @return bool|void
     */
    public function delete($files)
    {
        try {
            $params['files'] = is_array($files) ? $files : [$files];

            $response = $this->client->delete($this->config['path'], $params);

            $response = json_decode($response, true);

            if ($response['code'] == 200) {
                Log::info('cache successfully flushed files: '.json_encode($params));

                return true;
            } else {
                Log::info('cannot flush cache, response: '.json_encode($response));
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
}
