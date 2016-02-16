<?php

namespace Stensul\Http\Controllers;

use Worker;

class QueueController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Queue Controller
    |--------------------------------------------------------------------------
    |
    | This controller is to interact with the job queue.
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the status of the job.
     *
     * @params string $task Task name
     * @params string $job_id
     *
     * @return array Status and data
     */
    public function getStatus($task = 'process', $job_id = null)
    {
        return Worker::find($job_id, $task);
    }
}
