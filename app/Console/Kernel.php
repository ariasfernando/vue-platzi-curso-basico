<?php

namespace Stensul\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        'Stensul\Console\Commands\User\Create',
        'Stensul\Console\Commands\User\Roles',
        'Stensul\Console\Commands\User\Delete',
        'Stensul\Console\Commands\User\Show',
        'Stensul\Console\Commands\User\Restore',
        'Stensul\Console\Commands\Role\Show',
        'Stensul\Console\Commands\Role\PermissionAllow',
        'Stensul\Console\Commands\Role\PermissionDeny',
        'Stensul\Console\Commands\Role\Create',
        'Stensul\Console\Commands\Role\Delete',
        'Stensul\Console\Commands\Role\LibraryAllow',
        'Stensul\Console\Commands\Role\LibraryDeny',
        'Stensul\Console\Commands\Permission\Create',
        'Stensul\Console\Commands\Permission\Show',
        'Stensul\Console\Commands\Permission\Delete',
        'Stensul\Console\Commands\Task\UpdateLastModifyBy',
        'Stensul\Console\Commands\Task\GroupToRoles',
        'Stensul\Console\Commands\Task\EmailToLower',
        'Stensul\Console\Commands\Module\Create',
        'Stensul\Console\Commands\Task\CreatedBy',
        'Stensul\Console\Commands\Tool\Scraper',
    ];

    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     */
    protected function schedule(Schedule $schedule)
    {
        if (\Config::get('api.scraper.status') && \Config::get('api.scraper.settings.daily_preload')) {
            $schedule->command('tool:scraper')->dailyAt(\Config::get('api.scraper.settings.daily_preload_at'));
        }
    }
}
