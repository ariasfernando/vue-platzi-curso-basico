<?php

namespace Stensul\Tests;

class CampaignTest extends TestCase
{

    /**
     * User test.
     *
     * @covers Stensul\Models\Campaign::user()
     */
    public function testUser()
    {

        $this->assertInstanceOf('Jenssegers\Mongodb\Relations\BelongsTo', $this->campaign->user());
    }

    /**
     * fsRelativePath test.
     *
     * @covers Stensul\Models\Campaign::fsRelativePath()
     */
    public function testFsRelativePath()
    {

        $this->assertRegExp("/^\/[a-f0-9]{24}\/en_us$/", $this->campaign->fsRelativePath());
    }

    /**
     * url test.
     *
     * @covers Stensul\Models\Campaign::url()
     */
    public function testUrl()
    {

        $url = addcslashes(rtrim(\Config::get('app.url'), '/'), '/');
        $this->assertRegExp("/^" . $url . "\/images\/campaigns\/[a-f0-9]{24}\/en_us$/", $this->campaign->url());
    }

    /**
     * CDN path test.
     *
     * @covers Stensul\Models\Campaign::getCdnPath()
     */
    public function testGetCdnPath()
    {

        $relative = $this->campaign->getCdnPath();
        $absolute = $this->campaign->getCdnPath(true);

        $cdn = addcslashes(rtrim(\Config::get('cdn.host'), '/'), '/');

        $this->assertRegExp("/^[a-z0-9]{10}\/en_us$/", $relative);
        $this->assertRegExp("/^" . $cdn . '\/' . addcslashes($relative, '/') . "$/", $absolute);
    }
}
