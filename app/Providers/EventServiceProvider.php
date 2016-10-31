<?php

namespace Stensul\Providers;

use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Queue\Events\JobFailed;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event handler mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'Aacotroneo\Saml2\Events\Saml2LoginEvent' => [
            'Aacotroneo\Saml2\Events\Saml2LoginEvent',
        ],
    ];

    /**
     * Register any other events for your application.
     *
     * @SuppressWarnings("unused")
     *
     */
    public function boot()
    {
        parent::boot();

        \Queue::failing(
            function (JobFailed $event) {

                // Set job status as failed.
                if ($event->job->getJobId() && $event->job->attempts())
                {
                    \Worker::failed($event->job->getJobId());
                    \Log::error(sprintf(
                        "Failed to process job\n\nid: %s\nAttempts: %d",
                        $event->job->getJobId(),
                        $event->job->attempts()
                    ));
                }
            }
        );
    }
}
