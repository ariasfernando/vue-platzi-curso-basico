<?php

namespace Stensul\Managers;

use Illuminate\Filesystem\FilesystemManager as LaravelFilesystemManager;
use Stensul\Adapters\Filesystem\AwsS3SseAes256Adapter;
use Aws\Result;
use Aws\S3\Exception\DeleteMultipleObjectsException;
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;
use League\Flysystem\Adapter\AbstractAdapter;
use League\Flysystem\AdapterInterface;
use League\Flysystem\Config;
use League\Flysystem\Filesystem as Flysystem;

class FilesystemManager extends LaravelFilesystemManager
{

    /**
     * Create an instance of the Amazon S3 driver.
     *
     * @param  array  $config
     * @return \Illuminate\Contracts\Filesystem\Cloud
     */
    public function createS3Driver(array $config)
    {
        $config += [
            'credentials' => array_only($config, ['key', 'secret']),
            'version'     => 'latest',
        ];

        unset($config['key'], $config['secret']);

        return $this->adapt(
            new Flysystem(new AwsS3SseAes256Adapter(new S3Client($config), $config['bucket']))
        );
    }
}
