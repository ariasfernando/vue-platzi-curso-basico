<?php

namespace Stensul\Jobs;

use Activity;
use EmailSender;
use Carbon\Carbon;
use Stensul\Jobs\Job;
use UserModel;
use ProofModel;
use CampaignModel;
use MongoDB\BSON\ObjectID as ObjectID;
use MongoDB\BSON\UTCDateTime;
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
     * @var ProofModel
     */
    protected $proof;

    /**
     * @var String
     */
    protected $type;

    /**
     * @var Array
     */
    protected $params;

    /**
     * @var Array
     */
    protected $stats = ['success' => 0, 'error' => 0];

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(ProofModel $proof, $type, $params = [])
    {
        $this->proof = $proof;
        $this->type = $type;
        $this->params = $params;
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

        $method = 'send' . studly_case($this->type) . 'Notification';

        if (method_exists($this, $method)) {
            \Log::info(sprintf('Starting SendReviewersEmail:%s process for proof %s', $method, $this->proof->id));
            $this->$method();
            \Log::info(sprintf('SendReviewersEmail:%s finished for proof %s. Success %d Error %d',
                $method,
                $this->proof->id,
                $this->stats['success'],
                $this->stats['error']
            ));
        } else {
            \Log::error(sprintf('Method SendReviewersEmail:%s not exist', $method));
        }
    }

    /**
     * Send this notification to each reviewer when a proof was created
     */
    protected function sendNewProofNotification()
    {
        $reviewers = $this->proof->reviewers;
        $requestor = UserModel::find($this->proof->requestor);
        $campaign = CampaignModel::find($this->proof->campaign_id);

        $data = [
            'requestor' => $requestor->name .' '. $requestor->last_name,
            'proof_url' => url('proof/review', $this->proof->token),
            'type' => 'new_proof',
            'notification_message_to_all' => $this->proof->notification_message_to_all,
            'send_to_all' => (isset($this->proof->send_to_all) && $this->proof->send_to_all === true)
        ];

        if ($data['send_to_all']) {
            Activity::log('Send proof notification to all reviewers.', [
                'properties' => [
                    'proof_id' => new ObjectId($this->proof->id)
                ]
            ]);

            $this->proof->unset('send_to_all');
        }

        array_walk($reviewers, function (&$reviewer) use ($data) {
            if ($data['send_to_all'] || !isset($reviewer['notified']) || !$reviewer['notified']) {
                $user = UserModel::find($reviewer['user_id']);
                $data['reviewer'] = $reviewer;
                if (EmailSender::sendApprovalsEmail($user, $this->proof, $this->type, $data)) {

                    $date = new UTCDateTime();
                    $reviewer['notified'] = true;
                    $reviewer['notified_at'] = $date->toDateTime();

                    Activity::log('Reviewer has been notified of a new proof', [
                        'properties' => [
                            'proof_id' => new ObjectId($this->proof->id),
                            'reviewer_id' => new ObjectId($reviewer['user_id']),
                            'notification_type' => $this->type
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
        $campaign = CampaignModel::withTrashed()->find($this->proof->campaign_id);

        array_walk($reviewers, function (&$reviewer) {
            if (!isset($reviewer['proof_deleted']) || !$reviewer['proof_deleted']) {
                $user = UserModel::find($reviewer['user_id']);
                if (EmailSender::sendApprovalsEmail($user, $this->proof, $this->type)) {
                    $date = new UTCDateTime();
                    $reviewer['proof_deleted'] = true;
                    $reviewer['proof_deleted_at'] = $date->toDateTime();

                    Activity::log('Reviewer has been notified of a deleted campaign with a proof', [
                        'properties' => [
                            'proof_id' => new ObjectId($this->proof->id),
                            'reviewer_id' => new ObjectId($reviewer['user_id']),
                            'notification_type' => $this->type
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

    /**
     * Send this notification to the requestor of the proof when a reviewer adds a comment
     */
    protected function sendNewCommentNotification()
    {
        $requestor = UserModel::find($this->proof->requestor);

        $data = [
        	'comment' => $this->params['comment'],
        	'proof_url' => url('proof/review', $this->proof->token)
        ];

        if (!isset($this->params['comment']['notified']) || !$this->params['comment']['notified']) {
            if (EmailSender::sendApprovalsEmail($requestor, $this->proof, $this->type, $data)) {
                $date = new UTCDateTime();
                $this->params['comment']->notified = true;
                $this->params['comment']->notified_at = $date->toDateTime();
                $this->params['comment']->save();

                Activity::log('Requestor of the proof has been notified of a new comment', [
                    'properties' => [
                        'proof_id' => new ObjectId($this->proof->id),
                        'reviewer_id' => new ObjectId($this->params['comment']->user_id),
                        'comment_id' => new ObjectId($this->params['comment']->_id),
                        'notification_type' => $this->type
                    ]
                ]);
                $this->stats['success']++;
            } else {
                $this->stats['error']++;
            }
        }
    }

    /**
     * Send this notification to the requestor of the proof when a reviewer has taken a decision
     */
    protected function sendDecisionTakenNotification()
    {
        $requestor = UserModel::find($this->proof->requestor);

        $data = $this->params;
        $data['proof_url'] = url('proof/review', $this->proof->token);
        $data['email_url'] = url('campaign/edit', $this->proof->campaign_id);
        $data['reviewer_data'] = UserModel::find($this->params['reviewer']['user_id']);
        $data['decision'] = strpos($this->params['reviewer']['decision'], 'approve') !== false ? 'approved' : 'rejected';
        $data['with_comment'] = strpos($this->params['reviewer']['decision'], '-with-comments') !== false;

        // If we have an "approved", we need to check if all the reviewers has taken the same decision
        if ($data['decision'] === 'approved') {
            $data['fully_approved'] = true;
            foreach ($this->proof->reviewers as $k => $v) {
                if ((string) $v['user_id'] !== (string) $this->params['reviewer']['user_id']) {
                    if (!isset($v['decision']) || strpos($v['decision'], 'approve') === false) {
                        $data['fully_approved'] = false;
                    }
                }
            }
        }

        // Decide the type of the notification
        $type = 'proof_rejected';
        if ($data['decision'] === 'approved') {
            $type = $data['fully_approved'] ? 'proof_fully_approved' : 'proof_approved';
        }

        if (!isset($data['reviewer']['requestor_notified']) || $data['reviewer']['requestor_notified']) {
            if (EmailSender::sendApprovalsEmail($requestor, $this->proof, $type, $data)) {
                // Save the notification info in the reviewer
                $reviewers = [];
                foreach ($this->proof->reviewers as $reviewer) {
                    if ($reviewer['email'] === $data['reviewer']['email']) {
                        $date = new UTCDateTime();
                        $reviewer['requestor_notified'] = true;
                        $reviewer['requestor_notified_at'] = $date->toDateTime();
                    }
                    $reviewers[] = $reviewer;
                }
                $this->proof->reviewers = $reviewers;
                $this->proof->save();

                Activity::log('Requestor of the proof has been notified of a decision', [
                    'properties' => [
                        'proof_id' => new ObjectId($this->proof->id),
                        'requestor_id' => new ObjectId($this->proof->requestor),
                        'reviewer_id' => new ObjectId($this->params['reviewer']['user_id']),
                        'decision' => $this->params['reviewer']['decision'],
                        'notification_type' => $type
                    ]
                ]);

                $this->stats['success']++;
            } else {
                $this->stats['error']++;
            }
        }
    }
}
