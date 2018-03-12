<?php

namespace Stensul\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{

    /**
     * Automatically load commands.
     *
     * @return void
     */
    protected function commands() {
        $this->load(__DIR__ . '/Commands');
    }

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
