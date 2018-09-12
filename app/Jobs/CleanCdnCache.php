<?php

namespace Stensul\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Stensul\Models\Campaign;
use Cdn;
use Log;

class CleanCdnCache implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * File to flush from CDN
     *
     * @var [string]
     */
    private $file;

    /**
     * Campaign id only for logging purposes.
     *
     * @var [string]
     */
    private $campaign_id;

    /**
     * Create a new job instance.
     *
     * @param string $file
     * @param string $campaign_id
     * @return void
     */
    public function __construct(String $file, String $campaign_id)
    {
        $this->file = $file;
        $this->campaign_id = $campaign_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info(sprintf('[%s] flushing cache', $this->campaign_id));
        Cdn::disk()->delete($this->file);
    }
}
