<?php

namespace Stensul\Tests;

use Stensul\Services\CampaignManager;

class CampaignManagerTest extends TestCase
{
 
    /**
     * Test create.
     * @covers \Stensul\Services\CampaignManager::create
     */
    public function testCreate()
    {
        // Already instanced on TestCase::setUp.
        $this->assertInstanceOf('Stensul\Models\Campaign', $this->campaign);
        $this->assertInstanceOf('Carbon\Carbon', $this->campaign->created_at);
    }

    /**
     * Test copy.
     * @covers \Stensul\Services\CampaignManager::copy
     */
    public function testCopy()
    {
        $campaign = CampaignManager::copy($this->campaign->id);
        $this->assertArrayHasKey('campaign_id', $campaign);
    }

    /**
     * Test delete.
     * @covers \Stensul\Services\CampaignManager::delete
     */
    public function testDelete()
    {
        // Test deleting an existing campaign (copy the campaign created during setup).
        $newCampaign = CampaignManager::copy($this->campaign->id);
        $response = CampaignManager::delete($newCampaign['campaign_id']);
        $this->assertArrayHasKey('success', $response);

        // Try deleting a non existant campaign.
        $response = CampaignManager::delete('fake_campaign_id');
        file_put_contents('/tmp/debug', print_r($response, true));


        $this->assertArrayHasKey('error', $response);

    }

    /**
     * Test find.
     * @covers \Stensul\Services\CampaignManager::find
     */
    public function testFind()
    {

        $response = CampaignManager::find($this->campaign->id);
        $this->assertArrayHasKey('campaign_id', $response);

        $response = CampaignManager::find('fake_campaign_id');
        $this->assertFalse($response);
    }

    /**
     * Test process.
     * @covers \Stensul\Services\CampaignManager::process
     */
    public function testProcess()
    {

        $response = CampaignManager::process($this->campaign->id);
        $this->assertArrayHasKey('job', $response);
    }

    /** Test text
     * @covers \Stensul\Services\CampaignManager::text
     * @todo More tests needed WIP
     */
    public function testText()
    {

        $response = CampaignManager::text($this->campaign->id);
        $this->assertNotEmpty($response);
    }
}
