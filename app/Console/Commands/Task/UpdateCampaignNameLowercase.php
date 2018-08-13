<?php

namespace Stensul\Console\Commands\Task;

use TagModel as Tag;
use CampaignModel as Campaign;
use Illuminate\Console\Command;

class UpdateCampaignNameLowercase extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'task:update-campaign-name-lowercase';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update campaign names to lowercase.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('>>> Update campaign name to lowercase for better sorting..');
        $campaigns = Campaign::withTrashed()->get();
        foreach ($campaigns as $campaign) {
            if (isset($campaign->campaign_name)) {
                $campaign->lower_campaign_name = strtolower($campaign->campaign_name);
                $campaign->timestamps = false;
                $this->info(sprintf('Campaign %s: updated [%s] to [%s]', $campaign->id, $campaign->campaign_name, $campaign->lower_campaign_name));
                $campaign->save();
            }
        }
        $this->info('Done.');
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [];
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [];
    }
}
