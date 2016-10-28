<?php

namespace Stensul\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Models\Campaign;
use Stensul\Services\EmailHtmlCreator as Html;
use Stensul\Services\StaticProcessor as Assets;
use Activity;
use Worker;

class ProcessCampaign implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    private $campaign_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($campaign_id)
    {
        $this->campaign_id = $campaign_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $job_id = $this->job->getJobId();

        Worker::start($job_id, 'process');

        $campaign = Campaign::findOrFail($this->campaign_id);

        $html = new Html($campaign);
        $assets = new Assets($campaign);

        $html->createHtmlBody();
        $html->storeHtmlInCdn();

        if (!env('CDN_UPLOAD_PRETEND', false)) {
            $assets->storeAssetsInCdn();
        }

        $campaign->processed = 1;
        $campaign->published_at = strtotime(date('c'));
        $campaign->save();

        Worker::finish($job_id, 'process');

        Activity::Log(
            'job finished [process]',
            Worker::metadata(
                $job_id,
                'process',
                array('properties' => ['campaign_id' => new ObjectID($this->campaign_id)])
            )
        );

        $this->job->delete();
    }
}
