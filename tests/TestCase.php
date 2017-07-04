<?php

namespace Stensul\Tests;

use Stensul\Models\User;

require_once __DIR__ . DIRECTORY_SEPARATOR . 'PHPUnit_Framework_TestCase.php';

class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
    protected $campaign;
    protected $user;
    protected $domain;

    /**
     * Base url of the application, APP_BASE_URL must be set in .env file.
     * @var string $baseUrl
     */
    public $baseUrl;

    /**
     * Setup environment for tests.
     */
    public function setUp()
    {
        parent::setUp();

        \Config::set('database.default', 'mongodb_testing');
        \Config::set('mail.driver', 'log');
        \Artisan::call('migrate:refresh');

        $this->domain = preg_replace(['/^http(s)?:\/\//', '/\/$/'], '', url('/'));
        $this->baseUrl = url('/');

        $params = [
            'name' => 'test',
            'email' => 'test@stensul.com',
            'password' => bcrypt('qwe123')
        ];

        $this->user = User::create($params);

        /* @todo These asserts might be moved to a User test file later */
        $this->assertInstanceOf('Stensul\Models\User', $this->user);
        $this->assertInstanceOf('Carbon\Carbon', $this->user->created_at);
        \Auth::login($this->user);

        // Check successful login
        $this->assertInstanceOf('Stensul\Models\User', \Auth::getUser());

        $params = ['user_id' => \Auth::id()];
        $this->campaign = \Stensul\Services\CampaignManager::create($params);
    }

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

        return $app;
    }
}
