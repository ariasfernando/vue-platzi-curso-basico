<?php

namespace Stensul\Tests;

use Illuminate\Foundation\Testing\WithoutMiddleware;

class ModulesTest extends TestCase
{

    // Disable csrf checking.
    use WithoutMiddleware;
    /**
     * Test campaign modules.
     *
     */
    public function testModules()
    {

        $url = '/template/module?app_name=base&library_name=default' .
            '&campaign_id=' . $this->campaign->id;

        $modules = \Config::get('modules');

        // Enable user error handling
        libxml_use_internal_errors(true);

        foreach ($modules as $moduleId => $module) {
            $response = $this->call('GET', $url . '&name=' . $moduleId);

            $this->assertEquals(200, $response->getStatusCode());
            $this->assertNotEmpty($response->content());

            $doc = new \DOMDocument();
            $doc->loadHTML($response->content());

            foreach (libxml_get_errors() as $error) {
                $message = sprintf(
                    "Error in module '$moduleId', Line: %d, Column: %d, Message: %s",
                    $error->line,
                    $error->column,
                    $error->message
                );

                $this->assertNotInstanceOf('LibXMLError', $error, $message);
            }
            libxml_clear_errors();

            $body = $doc->documentElement->childNodes->item(0);
            $module = $body->childNodes->item(0);

            $attrs = $module->attributes;

            foreach ($attrs as $k => $v) {
                if ($k == 'data-params') {
                    $moduleAttributes = json_decode($v->nodeValue);
                    $this->assertEquals($moduleAttributes->type, $moduleId);
                }
            }

        }

    }
}
