<?php

namespace Stensul\Providers;

use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

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
     * (Ignoring unused variables $connection and $job as they're not used
     * but important for the Queue::failing callback to work)
     *
     * @SuppressWarnings("unused")
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $events
     *
     */
    public function boot(DispatcherContract $events)
    {
        parent::boot($events);

        \Queue::failing(
            function ($connection, $job, $data) {

                // Set job status as failed.
                \Worker::failed($data['id']);

                \Log::error(sprintf(
                    "Failed to process job\n\nid: %s\nAttempts: %d",
                    $data['id'],
                    $data['attempts']
                ));

            }
        );
    }
}
