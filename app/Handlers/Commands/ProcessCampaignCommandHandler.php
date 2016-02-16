<?php

namespace Stensul\Handlers\Commands;

use Log;
use Worker;
use Activity;
use Stensul\Models\Campaign;
use Stensul\Services\EmailHtmlCreator as Html;
use Stensul\Services\StaticProcessor as Assets;
use Stensul\Commands\ProcessCampaignCommand;

class ProcessCampaignCommandHandler
{
    /**
     * Handle campaign process command.
     *
     * @param ProcessCampaignCommand $command
     */
    public function handle(ProcessCampaignCommand $command)
    {
        $job_id = $command->getJob()->getJobId();

        Worker::start($job_id, 'process');

        $campaign = Campaign::findOrFail($command->getCampaignId());

        $html = new Html($campaign);
        $assets = new Assets($campaign);

        $html->createHtmlBody();

        $html->storeHtmlInCdn();

        if (!env('CDN_UPLOAD_PRETEND', false)) {
            $assets->storeAssetsInCdn();
        }

        $campaign->processed = 1;
        $campaign->published_at = new \MongoDate(strtotime(date('c')));
        $campaign->save();

        Worker::finish($job_id, 'process');

        Activity::Log(
            'job finished [process]',
            Worker::metadata(
                $job_id,
                'process',
                array('properties' => ['campaign_id' => new \MongoId($command->getCampaignId())])
            )
        );

        $command->getJob()->delete();
    }
}
