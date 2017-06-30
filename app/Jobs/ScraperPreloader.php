<?php

namespace Stensul\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use MongoDB\BSON\ObjectID as ObjectID;
use Activity;
use Worker;

class ScraperPreloader implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    private $scraper_driver;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($scraper_driver)
    {
        $this->scraper_driver = $scraper_driver;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $job_id = $this->job->getJobId();

        Worker::start($job_id, 'scraper');

        $this->scraper_driver->getPublicImages();
        $job->delete();

        Worker::finish($job_id, 'scraper');

        Activity::Log(
            'job finished [scraper]',
            Worker::metadata(
                $job_id,
                'get public images'
            )
        );

        $this->job->delete();
    }
}
