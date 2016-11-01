<?php

namespace Stensul\Tests;

use Stensul\Models\User;

class UserTest extends TestCase
{

    /**
     * Get avatar test.
     *
     * @covers Stensul\Models\User::getAvatar()
     */
    public function testGetAvatar()
    {
        $user = new User(['email' => 'testemail@stensul.com']);
        $url = $user->getAvatar(30);

        $this->assertEquals(
            'https://www.gravatar.com/avatar/842b97c042d7c814ff9bf029a3cc6f92?'
            . 'd=http%3A%2F%2F'. $this->domain .'%2Fimages%2F_common%2Fdefault_avatar.jpg'
            . '&d=identicon&r=pg&s=30',
            $url
        );
    }

    /**
     * Get has role.
     *
     * @covers Stensul\Models\User::hasRole()
     */
    public function testHasRole()
    {
        $user = new User(['email' => 'testemail@stensul.com', 'roles' => ['test_group']]);
        $this->assertTrue($user->hasRole('test_group'));
        $this->assertNotTrue($user->hasRole('dummy_group'));
    }

    /**
     * Test if a user can see a library, roles, permissions.
     *
     * @covers Stensul\Models\User::see()
     * @covers Stensul\Models\User::getLibraries()
     * @covers Stensul\Models\User::getPermissions()
     * @covers Stensul\Models\User::can()
     */
/*    public function testSee()
    {
        $libraries = \Config::get("view.libraries", []);

        $libraries['dummy'] = [];

        // Inject dummy library into config.
        \Config::set('view.libraries', $libraries);

        // Check we're not seeing the dummy lib.
        $this->assertNotTrue($this->user->see('dummy'));

        // Test that there are no libraries in the array.
        $this->assertCount(0, $this->user->getLibraries());

        // Create a new role.
        $exit_code = \Artisan::call('role:create', ['role' => 'role1', 'description' => 'role1']);
        $this->assertEquals($exit_code, 0);

        // Assign new role to the test user.
        $exit_code = \Artisan::call('user:role', ['email' => 'test@stensul.com', 'role' => 'role1']);
        $this->assertEquals($exit_code, 0);

        // Allow the new role to see the dummy library.
        $exit_code = \Artisan::call('role:library:allow', ['role' => 'role1', 'library' => 'dummy']);
        $this->assertEquals($exit_code, 0);

        // Update the user model object from DB.
        $this->user = User::where('_id', '=', $this->user->id)->firstOrFail();

        // Test again, we should see the library now.
        $this->assertTrue($this->user->see('dummy'));

        // Test that we have the dummy library in the array.
        $this->assertContains('dummy', $this->user->getLibraries());

        // Create a new permission.
        $exit_code = \Artisan::call(
            'permission:create',
            ['permission' => 'permission1', 'description' => 'permission1']
        );
        $this->assertEquals($exit_code, 0);

        // Check that we don't have any permissions.
        $this->assertCount(0, $this->user->getPermissions());

        // Allow permission1 for the role.
         $exit_code = \Artisan::call('role:permission:allow', ['role' => 'role1', 'permission' => 'permission1']);
         $this->assertEquals($exit_code, 0);

        // Update the user model object from DB.
        $this->user = User::where('_id', '=', $this->user->id)->firstOrFail();

        // Test that we have the permission in the array.
        $this->assertContains('permission1', $this->user->getPermissions());

        // Test can method.
        $this->assertTrue($this->user->can('permission1'));
        $this->assertNotTrue($this->user->can('invalid_permission'));
        $this->assertTrue($this->user->can(array('invalid_permission', 'permission1')));
        $this->assertNotTrue($this->user->can(array('invalid_permission', 'invalid_permission2')));

    }*/
}
