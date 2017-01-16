<?php

namespace Stensul\Console\Commands\Tool;

use Campaign;
use Illuminate\Console\Command;

class Scraper extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tool:scraper';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run scraper preload.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function fire()
    {
        if (\Config::get('api.scraper.status') === true) {
            $libraries = \Config::get('api.scraper.sources.libraries');
            if (count($libraries)) {
                foreach ($libraries as $library => $api) {
                    Campaign::scraperPreloader($library, ['flush_cache' => true]);
                }
            }
        }
    }
}
