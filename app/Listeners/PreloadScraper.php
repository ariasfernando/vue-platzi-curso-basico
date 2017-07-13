<?php

namespace Stensul\Listeners;

use Artisan;
use Campaign;
use Stensul\Events;
use Stensul\Events\UserLoggedIn;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class PreloadScraper
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     */
    public function handle()
    {
        if (\Config::get('api.scraper.status') === true
            && \Config::get('api.scraper.settings.login_preload')) {
            Artisan::call('tool:scraper');
        }
    }
}
