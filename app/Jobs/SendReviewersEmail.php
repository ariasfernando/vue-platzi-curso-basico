<?php

namespace Stensul\Jobs;

use Activity;
use EmailSender;
use Carbon\Carbon;
use Stensul\Jobs\Job;
use Stensul\Models\User;
use Stensul\Models\Proof;
use Stensul\Models\Campaign;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * This job is in charge of send the notification
 * emails to reviewers of a given proof.
 */
class SendReviewersEmail extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * @var Stensul\Models\Proof
     */
    protected $proof;

    /**
     * @var String
     */
    protected $type;

    /**
     * @var Array
     */
    protected $stats = ['success' => 0, 'error' => 0];

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Proof $proof, $type)
    {
        $this->proof = $proof;
        $this->type = $type;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->attempts() > 3) {
            // Force finish
            \Log::error(sprintf(
                "The process of send emails to reviewers failed. [proof %s]. Try %d",
                $this->proof->id,
                $this->attempts()
            ));
            return false;
        }

        switch ($this->type) {
            case 'new_proof':
                $method = 'sendNewProofNotification';
                break;
            case 'deleted_proof':
                $method = 'sendDeletedProofNotification';
                break;
            default:
                $method = '';
                break;
        }

        if (strlen($method)) {
            if (method_exists($this, $method)) {
                \Log::info(sprintf('Starting SendReviewersEmail:%s process for proof %s', $method, $this->proof->id));

                $this->$method();

                \Log::info(sprintf(
                    'SendReviewersEmail:%s finished for proof %s. Success %d Error %d',
                    $method,
                    $this->proof->id,
                    $this->stats['success'],
                    $this->stats['error']
                ));
            } else {
                \Log::error(sprintf('Called method SendReviewersEmail:%s not exists', $method));
            }
        } else {
            \Log::error('Missing method in SendReviewersEmail');
        }
    }

    /**
     * Send this notification to each reviewer when a proof was created
     */
    protected function sendNewProofNotification()
    {
        $reviewers = $this->proof->reviewers;
        $requestor = User::find($this->proof->requestor);
        $campaign = Campaign::find($this->proof->campaign_id);

        $params = [
            'proof_id' => $this->proof->id,
            'requestor' => $requestor->name,
            'campaign_name' => $campaign->campaign_name,
            'proof_url' => url('proof/review', $this->proof->token),
            'type' => 'new_proof',
            'send_to_all' => (isset($this->proof->send_to_all) && $this->proof->send_to_all == 1)
        ];

        if ($params['send_to_all']) {
            Activity::log('Send proof notification to all reviewers.', [
                'properties' => [
                    'proof_id' => new ObjectId($this->proof->id)
                ]
            ]);

            $this->proof->unset('send_to_all');
        }

        array_walk($reviewers, function (&$reviewer) use ($params) {
            if ($params['send_to_all'] || !isset($reviewer['notified']) || !$reviewer['notified']) {
                if (EmailSender::sendReviewerEmail($reviewer, $params)) {
                    $reviewer['notified'] = true;
                    $reviewer['notified_at'] = new \MongoDate(strtotime(date('c')));

                    Activity::log('Reviewer has been notified of a new proof', [
                        'properties' => [
                            'proof_id' => new ObjectId($this->proof->id),
                            'reviewer_id' => new ObjectId($reviewer['user_id'])
                        ]
                    ]);

                    $this->stats['success']++;
                } else {
                    $this->stats['error']++;
                }
            }
        });

        $this->proof->reviewers = $reviewers;

        if ($this->stats['error'] > 0) {
            // Every reviewer was notified
            $this->proof->all_notified = true;
        }

        $this->proof->save();
    }

    /**
     * Send this notification when a campaign with an active proof was deleted
     */
    protected function sendDeletedProofNotification()
    {
        $reviewers = $this->proof->reviewers;
        $campaign = Campaign::withTrashed()->find($this->proof->campaign_id);

        $params = [
            'proof_id' => $this->proof->id,
            'campaign_name' => $campaign->campaign_name,
            'type' => 'deleted_proof'
        ];

        array_walk($reviewers, function (&$reviewer) use ($params) {
            if (!isset($reviewer['proof_deleted']) || !$reviewer['proof_deleted']) {
                if (EmailSender::sendReviewerEmail($reviewer, $params)) {
                    $reviewer['proof_deleted'] = true;
                    $reviewer['proof_deleted_at'] = new \MongoDate(strtotime(date('c')));

                    Activity::log('Reviewer has been notified of a deleted campaign with a proof', [
                        'properties' => [
                            'proof_id' => new ObjectId($this->proof->id),
                            'reviewer_id' => new ObjectId($reviewer['user_id'])
                        ]
                    ]);

                    $this->stats['success']++;
                } else {
                    $this->stats['error']++;
                }
            }
        });

        $this->proof->reviewers = $reviewers;

        $this->proof->save();
    }
}
