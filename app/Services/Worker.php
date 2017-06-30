<?php

namespace Stensul\Services;

use Log;
use Cache;
use Carbon\Carbon;
use MongoDB\BSON\ObjectID as ObjectID;

/*
|--------------------------------------------------------------------------
| Worker service
|--------------------------------------------------------------------------
|
| This service manage an internal cache job queue to check status
| and provide a frontend verification using only the cache core.
|
*/

class Worker
{
    /**
     * Get job metadata.
     *
     * @param  string  job_id
     * @param  string  task_name
     *
     * @return array metadata of task
     */
    public static function metadata($job_id, $task = 'process', $params = array())
    {
        $data = [
            'properties' => [],
        ];

        if ($job_id) {
            if (Cache::has('job:'.$task.':'.$job_id)) {
                $data = Cache::get('job:'.$task.':'.$job_id);
            }
        }

        $properties = (isset($params['properties'])) ? $params['properties'] : [];

        $data['properties'] = array_merge($data['properties'], $properties);

        return $data;
    }

    /**
     * Find a job status.
     *
     * @param  string  job_id
     * @param  string  task_name
     *
     * @return array status and data of task
     */
    public static function find($job_id, $task = 'process')
    {
        $job_data = [];
        $data = [];

        if (Cache::has('job:'.$task.':'.$job_id)) {
            $job_data = Cache::get('job:'.$task.':'.$job_id);
            $data = self::getQueueInfo($task);
            $data['job_id'] = $job_id;
        }

        if (isset($job_data['status'])) {
            $status = $job_data['status'];
        } else {
            \Log::error("exception: job ID $job_id not found");
            $status = 'not-found';
        }

        return array('status' => $status, 'data' => $data);
    }

    /**
     * write a job.
     *
     * @param  string  job_id
     * @param  string  task_name
     * @param  string  status
     * @param  string  decrement
     */
    public static function write($job_id, $task, $status = 'queued', $decrement = null)
    {
        $route = explode('@', last(explode('\\', \Route::currentRouteAction())));

        $metadata = [
            'user_agent' => (isset($_SERVER['HTTP_USER_AGENT'])) ? $_SERVER['HTTP_USER_AGENT'] : '',
            'ip' => (isset($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : '',
            'controller' => head($route),
            'action' => last($route),
            'properties' => [
                'user_id' => \Auth::id(),
            ],
        ];

        if (Cache::has('job:'.$task.':'.$job_id)) {
            $metadata = Cache::get('job:'.$task.':'.$job_id);
        }

        if ($status == 'queued') {
            $metadata['properties']['job_delay'] = strtotime(date('c'));
        }

        if ($status == 'finished') {
            $metadata['properties']['job_delay'] = (isset($metadata['properties']['job_delay']))
                ? strtotime(date('c')) - $metadata['properties']['job_delay']
                : 0;
        }

        $metadata['status'] = $status;

        Cache::put('job:'.$task.':'.$job_id, $metadata, Carbon::now()->addDays(1));

        self::setQueueInfo($task, $status, $decrement);
    }

    /**
     * reset queue info.
     *
     * @param  string  $task
     */
    public static function resetQueueInfo($task = 'process')
    {
        $queue_steps = [ "total", "queued", "started", "finished"];

        foreach ($queue_steps as $step) {
            if (Cache::has('job:'.$task.':'.$step)) {
                Cache::forget('job:'.$task.':'.$step);
            }
        }
    }

    /**
     * get queue info.
     *
     * @param  string  $task
     * @return array queueInfo
     */
    public static function getQueueInfo($task = 'process')
    {
        return [
            'total'    => (Cache::has('job:'.$task.':total')) ? Cache::get('job:'.$task.':total') : 0,
            'queued'   => (Cache::has('job:'.$task.':queued')) ? Cache::get('job:'.$task.':queued') : 0,
            'started'  => (Cache::has('job:'.$task.':started')) ? Cache::get('job:'.$task.':started') : 0,
            'finished' => (Cache::has('job:'.$task.':finished')) ? Cache::get('job:'.$task.':finished') : 0
        ];
    }

    /**
     * set queue info.
     *
     * @param  string  $task
     * @param  string  $step
     * @param  string  $decrement (if add this step decrement another on the list)
     */
    public static function setQueueInfo($task = 'process', $step = 'queued', $decrement = null)
    {

        if ($step == "queued") {
            if (Cache::has('job:'.$task.':total')) {
                Cache::increment('job:'.$task.':total');
            } else {
                Cache::add('job:'.$task.':total', 1, Carbon::now()->addDays(1));
            }
        }

        if (Cache::has('job:'.$task.':'.$step)) {
            Cache::increment('job:'.$task.':'.$step);
        } else {
            Cache::add('job:'.$task.':'.$step, 1, Carbon::now()->addDays(1));
        }

        if ($decrement && Cache::has('job:'.$task.':'.$decrement)) {
            if (Cache::get('job:'.$task.':'.$decrement) > 0) {
                Cache::decrement('job:'.$task.':'.$decrement);
            }
        }
    }

    /**
     * queue a job facade.
     *
     * @param  string  job_id
     * @param  string  task_name
     */
    public static function queue($job_id, $task = 'process')
    {
        self::write($job_id, $task, 'queued');
    }

    /**
     * start a job facade.
     *
     * @param  string  job_id
     * @param  string  task_name
     */
    public static function start($job_id, $task = 'process')
    {
        self::write($job_id, $task, 'started', 'queued');
    }

    /**
     * finish a job facade.
     *
     * @param  string  job_id
     * @param  string  task_name
     */
    public static function finish($job_id, $task = 'process')
    {
        self::write($job_id, $task, 'finished', 'started');
    }

    /**
     * Mark a job as failed.
     *
     * @param  string  job_id
     * @param  string  task_name
     */
    public static function failed($job_id, $task = 'process')
    {
        self::write($job_id, $task, 'failed', 'started');
    }
}
