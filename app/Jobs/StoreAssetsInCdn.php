<?php

namespace Stensul\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Statics as Assets;
use Stensul\Models\Campaign;

class StoreAssetsInCdn implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(Campaign $campaign)
    {
        $assets = new Assets($campaign);
        $assets->storeAssetsInCdn();
        $this->delete();
    }
}
