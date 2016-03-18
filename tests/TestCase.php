<?php

namespace Stensul\Tests;

class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
    protected $campaign;
    protected $user;

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
        \Artisan::call('migrate:refresh');
        \Mail::pretend(true);

        $this->baseUrl = env('APP_BASE_URL', '');

        $registrar = new \Stensul\Services\Registrar;

        $params = [
            'name' => 'test',
            'email' => 'test@stensul.com',
            'password' => bcrypt('qwe123')
        ];

        $registrar = new \Stensul\Services\Registrar;
        $this->user = $registrar->create($params);

        /* @todo These asserts might be moved to a User test file later */
        $this->assertInstanceOf('Stensul\Models\User', $this->user);
        $this->assertInstanceOf('Carbon\Carbon', $this->user->created_at);
        \Auth::login($this->user);

        // Check succcesful login
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
