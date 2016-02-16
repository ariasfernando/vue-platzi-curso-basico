<?php

namespace Stensul\Providers;

use Stensul\Managers\FilesystemManager;
use Illuminate\Filesystem\FilesystemServiceProvider as LaravelFilesystemServiceProvider;

class FilesystemServiceProvider extends LaravelFilesystemServiceProvider
{

    /**
     * Register the filesystem manager.
     *
     * @return void
     */
    protected function registerManager()
    {
        $this->app->singleton('filesystem', function () {
            return new FilesystemManager($this->app);
        });
    }
}
