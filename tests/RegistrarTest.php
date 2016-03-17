<?php

namespace Stensul\Tests;

use Stensul\Services\CampaignManager;
use Stensul\Services\Registrar;

class RegistrarTest extends TestCase
{

    /**
     * Validator test
     *
     * @covers Stensul\Services\Registrar::validator()
     */
    public function testValidator()
    {

        // Test with no errors.
        $registrar = new Registrar();
        $validator = $registrar->validator([
            'name' => 'test1',
            'email' => 'test@test.com',
            'password' => 'qwe123',
            'password_confirmation' => 'qwe123'
        ]);

        $messages = $validator->getMessageBag();

        $this->assertInstanceOf('Illuminate\Validation\Validator', $validator);
        $this->assertEmpty($messages);

        // Test with empty required parameters.
        $validator = $registrar->validator([]);
        $messages = $validator->getMessageBag()->getMessages();

        $this->assertArrayHasKey('name', $messages);
        $this->assertArrayHasKey('email', $messages);
        $this->assertArrayHasKey('password', $messages);

        // Test without password confirmation.
        $validator = $registrar->validator([
            'name' => 'test1',
            'email' => 'test@test.com',
            'password' => 'qwe123',
        ]);

        $messages = $validator->getMessageBag()->getMessages();
        $this->assertArrayHasKey('password', $messages);

        // Test with invalid email address.
        $validator = $registrar->validator([
            'name' => 'test1',
            'email' => 'invalid email',
            'password' => 'qwe123',
            'password_confirmation' => 'qwe123'
        ]);

        $messages = $validator->getMessageBag()->getMessages();
        $this->assertArrayHasKey('email', $messages);

        // Test with short password.
        $validator = $registrar->validator([
            'name' => 'test1',
            'email' => 'test@test.com',
            'password' => 'a',
            'password_confirmation' => 'a'
        ]);

        $messages = $validator->getMessageBag()->getMessages();
        $this->assertArrayHasKey('password', $messages);
    }

    /**
     * Create user test
     *
     * @covers Stensul\Services\Registrar::create()
     */
    public function testCreator()
    {

        $registrar = new Registrar();

        $user = $registrar->create([
            'name' => 'test1',
            'email' => 'test@test.com',
            'password' => 'qwe123',
            'group' => 'test_group'
        ]);

        $this->assertInstanceOf('Stensul\Models\User', $user);

    }
}
