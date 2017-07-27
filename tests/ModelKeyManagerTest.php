<?php

namespace Stensul\Tests;

use Stensul\Services\ModelKeyManager;
use Stensul\Models\Module;
use Stensul\Exceptions\ModelKeyManagerException;

class ModelKeyManagerTest extends TestCase
{
    /**
     * Test models key.
     *
     * @covers Stensul\Services\ModelKeyManager::getStandardKey()
     *
     */
    public function testGetStandardKey()
    {
        $module = new Module;
        $module->name = 'Test module name';
        $module->key = 'test_key';
        $module->structure = [];
        $module->status = 'draft';
        $module->type = 'studio';
        $module->save();

        for ($n = 0; $n < 6; $n++) {
            $module = new Module;
            $module->name = 'Test module name ' . $n;
            $module->key = 'test_key_' . $n;
            $module->structure = [];
            $module->status = 'draft';
            $module->type = 'studio';
            $module->save();
        }

        try {
            // Should fail because we can't find available keys to use.
            $key = ModelKeyManager::getStandardKey($module, 'test_key', 3);
        } catch (\Exception $exception) {
            $this->assertInstanceOf(ModelKeyManagerException::class, $exception);
        }

        $key = ModelKeyManager::getStandardKey($module, 'test_key', 10);
        $this->assertRegexp('/^test_key_[0-9]+$/', $key);
    }
}
