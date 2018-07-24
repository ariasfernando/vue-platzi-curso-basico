<?php

namespace Stensul\Tests;

use Stensul\Services\CampaignManager;
use Stensul\Exceptions\PermissionDeniedException;
use Stensul\Models\User;

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
        try {
            $campaign = CampaignManager::copy($this->campaign->id);
            $this->assertArrayHasKey('campaign_id', $campaign);
        } catch (\Exception $exception) {
            $this->assertInstanceOf(PermissionDeniedException::class, $exception);
        }

        // Add permission to clone campaign.
        $exit_code = \Artisan::call('role:permission:allow', ['--role' => 'role1', '--permission' => 'clone_campaign']);
        $this->assertEquals($exit_code, 0);

        // Assign new role to the test user and try again.
        $exit_code = \Artisan::call('user:roles', ['--email' => 'test@stensul.com', '--roles' => 'role1']);
        $this->assertEquals($exit_code, 0);

        // Update the user model object from DB.
        \Auth::login(User::where('_id', '=', $this->user->id)->firstOrFail());

        $campaign = CampaignManager::copy($this->campaign->id);
        $this->assertArrayHasKey('campaign_id', $campaign);
    }

    /**
     * Test delete.
     * @covers \Stensul\Services\CampaignManager::delete
     */
    public function testDelete()
    {
        // Give user clone_campaign permission for the next test.
        $exit_code = \Artisan::call('role:permission:allow', ['--role' => 'role1', '--permission' => 'clone_campaign']);
        $this->assertEquals($exit_code, 0);

        // Assign new role to the test user.
        $exit_code = \Artisan::call('user:roles', ['--email' => 'test@stensul.com', '--roles' => 'role1']);
        $this->assertEquals($exit_code, 0);

        // Update the user model object from DB.
        \Auth::login(User::where('_id', '=', $this->user->id)->firstOrFail());

        // Test deleting an existing campaign (copy the campaign created during setup).
        $newCampaign = CampaignManager::copy($this->campaign->id);
        $response = CampaignManager::delete($newCampaign['campaign_id']);
        $this->assertArrayHasKey('success', $response);

        // Try deleting a non existant campaign.
        $response = CampaignManager::delete('fake_campaign_id');

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
        $this->assertEmpty($response);
    }
}
