<?php

namespace Stensul\Adapters\Filesystem;

use League\Flysystem\AwsS3v3\AwsS3Adapter;
use League\Flysystem\Config;
use League\Flysystem\Util;

class AwsS3SseAes256Adapter extends AwsS3Adapter
{

    /**
     * Upload an object.
     *
     * @param        $path
     * @param        $body
     * @param Config $config
     *
     * @return array
     */
    protected function upload($path, $body, Config $config)
    {

        $config->set('ServerSideEncryption', 'AES256');

        return parent::upload($path, $body, $config);

    }
}
