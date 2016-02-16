<?php

namespace Stensul\Commands;

use Illuminate\Queue\SerializesModels;

class ProcessCampaignCommand extends Command
{
    use SerializesModels;

    protected $campaign_id;
    protected $job;

    /**
     * Create a new command instance.
     *
     * @param Object $job
     * @param string $campaign_id
     */
    public function __construct($job, $campaign_id)
    {
        $this->campaign_id = $campaign_id;
        $this->job = $job;
    }

    /**
     * Get campaign id.
     *
     * @return string
     */
    public function getCampaignId()
    {
        return $this->campaign_id;
    }

    /**
     * Get job object.
     *
     * @return Object
     */
    public function getJob()
    {
        return $this->job;
    }
}
