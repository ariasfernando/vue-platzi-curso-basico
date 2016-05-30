<?php

namespace Stensul\Tests;

use Stensul\Services\EmailHtmlCreator;
use Stensul\Models\Campaign;

/**
 * Test html email creator service
 *
 */
class EmailHtmlCreatorTest extends TestCase
{

    protected $html_service;
    private $css_urls = [];

    /**
     * Create instance of EmailHtmlCreator.
     *
     * @see \Stensul\Tests\TestCase::setUp()
     */
    public function setUp()
    {
        parent::setUp();
        $this->html_service = new EmailHtmlCreator($this->campaign);
    }

    /**
     * Get campaign test.
     *
     * @covers Stensul\Services\EmailHtmlCreator::getCampaign()
     */
    public function testGetCampaign()
    {

        $campaign = $this->html_service->getCampaign();

        $this->assertInstanceOf('Stensul\Models\Campaign', $campaign);
    }

    /**
     * Get email layout test.
     *
     * @covers Stensul\Services\EmailHtmlCreator::getEmailLayout()
     */
    public function testGetEmailLayout()
    {

        $layout = $this->html_service->getEmailLayout();

        $this->assertStringStartsWith('<!DOCTYPE html PUBLIC', $layout);
    }

    /**
     * Create html body test.
     *
     * @covers Stensul\Services\EmailHtmlCreator::createHtmlBody()
     */
    public function testCreateHtmlBody()
    {

        $body = $this->html_service->createHtmlBody();
        $this->assertStringStartsWith('<!DOCTYPE html PUBLIC', $body);
    }

    /**
     * Store html in CDN test.
     *
     * @covers Stensul\Services\EmailHtmlCreator::storeHtmlInCdn()
     */
    public function testStoreHtmlInCdn()
    {

        $cdn_path = $this->html_service->storeHtmlInCdn();

        $this->assertStringEndsWith('/en_us/index.html', $cdn_path);
    }

    /**
     * View in browser link test
     *
     * @covers Stensul\Services\EmailHtmlCreator::replaceViewInBrowserLink()
     */
    public function testReplaceViewInBrowserLink()
    {
        
        $body = '<p>' . EmailHtmlCreator::$VIEW_IN_BROWSER_TAG . '</p>';

        $this->html_service->setBody($body);
        $replaced = $this->html_service->replaceViewInBrowserLink();

         $this->assertEquals(
             $replaced,
             '<p>' . trim($this->campaign->getCdnPath(true), DS) . DS . EmailHtmlCreator::$HTML_FILENAME . '</p>'
         );
    }

    /**
     * Replace image path test.
     *
     * @covers Stensul\Services\EmailHtmlCreator::replaceImagesPath()
     */
    public function testReplaceImagesPath()
    {

        $body = '<html><body></body></html>';
        $this->html_service->setBody($body);
        // no images:
        $this->assertEquals($body, $this->html_service->replaceImagesPath());

        $img_names = [
            'test.gif',
            'test2.jpg',
            'test3.png',
            'test4.jpg'
        ];

        $body = '<html><body><img src="'. $img_names[0] .'" />
            <img src="'. $img_names[1] .'" ><img widht="20"
            src="http://test.com/'. $img_names[2] .'"
            ><p>
            <img class="dummy" id="dummy" src="'. $img_names[3] .'">
            </p>
            </body></html>';

        $this->html_service->setBody($body);

        $body_replaced = $this->html_service->replaceImagesPath();

        $doc = new \DOMDocument();
        $doc->loadHTML($body_replaced);

        $images = $doc->getElementsByTagName('img');

        // Change this number if testing more images above.
        $this->assertEquals($images->length, 4);

        $idx = 0;
        foreach ($images as $image) {
            foreach ($image->attributes as $attr => $value) {
                if ($attr == 'src') {
                    $this->assertStringStartsWith(
                        $this->campaign->getCdnPath(true),
                        $value->nodeValue
                    );

                    $this->assertStringEndsWith($img_names[$idx], $value->nodeValue);
                }
            }
            $idx++;
        }
    }

    /**
     * Replace font path test.
     *
     * @covers Stensul\Services\EmailHtmlCreator::replaceFontPath()
     */
    public function testReplaceFontPath()
    {

        // Sample CSS.
        $css = "
        	@font-face {
                font-family: 'matterhorn';
                src: url('". $this->baseUrl ."/fonts/matterhorn-regular.eot');
                src: url('". $this->baseUrl ."/fonts/matterhorn-regular.eot?#iefix') format('embedded-opentype'),
                    url('". $this->baseUrl ."/fonts/matterhorn-regular.woff') format('woff'),
                    url('". $this->baseUrl ."/fonts/matterhorn-regular.ttf') format('truetype'),
                    url('". $this->baseUrl ."/fonts/matterhorn-regular.svg#icon') format('svg');
                font-weight: normal;
                font-style: normal;
            }

            @font-face {
                font-family: 'matterhorn-bold';
                src: url('". $this->baseUrl ."/fonts/matterhorn-bold.eot');
                src: url('". $this->baseUrl ."/fonts/matterhorn-bold.eot?#iefix') format('embedded-opentype'),
                    url('". $this->baseUrl ."/fonts/matterhorn-bold.woff') format('woff'),
                    url('". $this->baseUrl ."/fonts/matterhorn-bold.ttf') format('truetype'),
                    url('". $this->baseUrl ."/fonts/matterhorn-bold.svg#icon') format('svg');
                font-weight: normal;
                font-style: normal;
            }
            ";

        // Resulting CSS must match this.
        $new_css = "
        	@font-face {
                font-family: 'matterhorn';
                src: url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-regular.eot');
                src: url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-regular.eot?#iefix')"
                    . " format('embedded-opentype'),
                    url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-regular.woff') format('woff'),
                    url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-regular.ttf') format('truetype'),
                    url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-regular.svg#icon') format('svg');
                font-weight: normal;
                font-style: normal;
            }

            @font-face {
                font-family: 'matterhorn-bold';
                src: url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-bold.eot');
                src: url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-bold.eot?#iefix') "
                    . "format('embedded-opentype'),
                    url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-bold.woff') format('woff'),
                    url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-bold.ttf') format('truetype'),
                    url('". $this->campaign->getCdnPath(true) ."/fonts/matterhorn-bold.svg#icon') format('svg');
                font-weight: normal;
                font-style: normal;
            }
            ";

        $css_parser = new \Sabberworm\CSS\Parser($css);
        $parsed = $css_parser->parse();
        $rule_sets = $parsed->getAllRuleSets();

        foreach ($rule_sets as $rule_set) {
            $rules = $rule_set->getRules('src');

            if (!empty($rules)) {
                foreach ($rules as $rule) {
                    $this->getFontURLs($rule->getValue());
                }
            }
        }

        $this->html_service->setBody($css);
        $replaced = $this->html_service->replaceFontPath();

        $this->assertEquals($new_css, $replaced);
    }

    /**
     * stripHtmlComments test.
     *
     * @covers Stensul\Services\EmailHtmlCreator::stripHtmlComments()
     */
    public function testStripHtmlComments()
    {
        $original = '
            <html><body>
                <!-- FOOTER --><div>-- TEST FOOTER --</div>
            <!-- footer --><p>test</p>
            <!-- VIEW IN BROWSER --><!-- VIEW IN BROWSER ENDS -->
            <br /><!-- VIEW IN BROWSER -->test view in browser<!-- VIEW IN BROWSER ENDS -->
            </body></html>';

        $expected = '
            <html><body>
                <p>test</p>
            &nbsp;
            <br />&nbsp;
            </body></html>';

        $this->html_service->setBody($original);
        $result = $this->html_service->stripHtmlComments();

        $this->assertEquals($result, $expected);
    }

    /**
     * Get font URLs from the CSS statements recursively.
     * @param \Sabberworm\CSS\Value\URL|\Sabberworm\CSS\Value\RuleValueList $values
     */
    private function getFontURLs($values)
    {

        if ($values instanceof \Sabberworm\CSS\Value\URL) {
            $this->css_urls[] = $values->getURL()->getString();
        } else {
            $components = $values->getListComponents();
            foreach ($components as $value) {
                if ($value instanceof \Sabberworm\CSS\Value\URL) {
                    $this->css_urls[] = $value->getURL()->getString();

                } elseif ($value instanceof \Sabberworm\CSS\Value\RuleValueList) {
                    $this->getFontURLs($value);
                }
            }
        }

    }
}
