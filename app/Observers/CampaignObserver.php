<?php

namespace Stensul\Observers;

use MongoDB\BSON\ObjectID;

class CampaignObserver
{
    /**
     * Delete module usage documents and add new ones.
     *
     * @param \CampaignModel $campaign
     * @return void
     */
    public function updated(\CampaignModel $campaign)
    {
        $this->resetUsage($campaign);
        $this->addUsage($campaign);
    }

    /**
     * Delete module usage documents.
     *
     * @param \CampaignModel $campaign
     * @return void
     */
    public function deleted(\CampaignModel $campaign)
    {
        $this->resetUsage($campaign);
    }

    /**
     * Delete module usage documents and add new ones.
     *
     * @param \CampaignModel $campaign
     * @return void
     */
    public function restored(\CampaignModel $campaign)
    {
        $this->resetUsage($campaign);
        $this->addUsage($campaign);
    }

    /**
     * Delete module usage documents and add new ones.
     *
     * @param \CampaignModel $campaign
     * @return void
     */
    public function created(\CampaignModel $campaign)
    {
        $this->resetUsage($campaign);
        $this->addUsage($campaign);
    }

    /**
     * Delete module usage documents.
     *
     * @param \CampaignModel $campaign
     * @return void
     */
    private function resetUsage(\CampaignModel $campaign)
    {
        \ModuleUsageModel::where('campaign_id', new ObjectId($campaign->id))->delete();
    }

    /**
     * Add new documents to module usage.
     *
     * @param \CampaignModel $campaign
     * @return void
     */
    private function addUsage(\CampaignModel $campaign)
    {
        foreach ($campaign->modules_data as $module) {
            if (isset($module['_id'])) {
                try {
                    \ModuleUsageModel::create([
                        'campaign_id' => new ObjectId($campaign->id),
                        'module_id' => new ObjectId($module['_id']),
                    ]);
                } catch (\Exception $e) {
                    \Log::info(sprintf(
                        'CampaignObserver: ignoring invalid module or campaign id; module: %s, campaign: %s',
                        $module['_id'],
                        $campaign->id
                    ));
                }
            }
        }
    }
}
