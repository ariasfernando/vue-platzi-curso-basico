<?php
namespace Stensul\Providers\Cdn;

use Akamai\Open\EdgeGrid\Client;

class AkamaiAdapter implements CdnInterface
{
    const AKAMAI_NETWORK = 'production';

    protected $config;
    protected $client;

    public function __construct($config)
    {
        $this->config = $config;
        $this->client = new Client([
            'base_uri' => $config['base_uri']
        ]);
        $this->client->setAuth($config['client_token'], $config['client_secret'], $config['access_token']);
    }

    public function delete($files)
    {
        $files = is_array($files) ? $files : [$files];
        $params['objects'] = [];
        foreach ($files as $file) {
            $params['objects'][] = rtrim(config('cdn.host'), '/') . '/' . ltrim($file, '/');
        }

        if (count($params['objects']) == 0) {
            \Log::warning('no objects queued to flush');
            return false;
        }

        try {
            $this->client->request(
                'POST',
                rtrim($this->config['path'], '/') . '/' . self::AKAMAI_NETWORK,
                ['json' => $params]
            );
            return true;
        } catch (\GuzzleHttp\Exception\GuzzleException $exception) {
            \Log::info(
                'cannot flush cache, response: '
                . (is_null($exception->getResponse()) ? 'null' : $exception->getResponse()->getBody())
            );
        }
    }
}
