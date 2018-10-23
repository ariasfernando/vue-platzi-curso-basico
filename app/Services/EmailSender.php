<?php

namespace Stensul\Services;

use MongoDB\BSON\ObjectID as ObjectID;
use CampaignModel;
use ProofModel as Proof;
use LibraryModel as Library;
use UserModel as User;
use Activity;
use Campaign;
use Helper;
use Mail;
use Auth;

class EmailSender
{

    /**
     * Send campaign email.
     *
     * @param string $campaign_id
     * @param string $email       Comma separated
     * @param array  $params
     *
     * @return array Response
     */
    public static function sendPreview($campaign_id, $email, $params = [])
    {
        if (!strlen($email)) {
            return ['error' => 'invalid emails'];
        }

        $response = [];

        $email_send_limit = 10;

        $email_array = Helper::parseEmails($email);

        if (!count($email_array)) {
            return ['error' => 'invalid emails'];
        }

        $campaign_data = CampaignModel::findOrFail($campaign_id);

        $subject = !empty($params['subject']) ? $params['subject'] : env('MAIL_PREVIEW_SUBJECT', 'Preview email!');

        $preheader = $params['preheader'] ?: false;

        $library = Library::find($campaign_data->library);

        $body_html = config('campaign.enable_html_minify', false) && !empty($campaign_data->body_html_minified) ? $campaign_data->body_html_minified : $campaign_data->body_html;

        for ($i = 0; $i < count($email_array); ++$i) {
            if ($i <= $email_send_limit) {
                $params = array(
                    'params' => array(
                        'title' => $campaign_data->campaign_name,
                        'body_html' => $campaign_data->body_html,
                        'campaign_data' => $campaign_data,
                        'preheader_preview' => $preheader,
                        'library_config' => $library->config,
                    ),
                    'email' => trim($email_array[ $i ]),
                    'subject' => $subject
                );

                Mail::send(
                    'layouts.email',
                    $params,
                    function ($message) use ($params) {
                        $message->from(
                            env('MAIL_FROM_ADDRESS', 'preview@stensul.com'),
                            env('MAIL_FROM_ADDRESS_NAME', 'Preview email')
                        )
                            ->to($params['email'])
                            ->subject($params['subject']);
                    }
                );

                Activity::log(
                    'Campaign email send try',
                    array('properties' => ['campaign_id' => new ObjectID($campaign_id),
                    'email' => $email])
                );

                $response['processed'][] = $email_array[$i];
            }
        }

        return $response;
    }

    /**
     * Send campaign email as attached files.
     *
     * @param string  $campaign_id
     * @param string  $email             Comma separated
     * @param boolean $send_text_version
     *
     * @return array Response
     */
    public static function sendPreviewAsAttachment($campaign_id, $email, $send_text_version = false)
    {
        if (!strlen($email)) {
            return ['error' => 'invalid emails'];
        }

        $response = [];

        $email_send_limit = 10;

        $email_array = Helper::parseEmails($email);

        $campaign_data = CampaignModel::findOrFail($campaign_id);

        $html_email = Campaign::html($campaign_id);

        $plain_text_email = $send_text_version ? Campaign::text($campaign_id) : null;

        $subject = "FINISHED CAMPAIGN (" . date("m/d/y h:i") . " EST): [" . $campaign_data->campaign_name . "]";

        $published_at = date("m/d/y h:i", strtotime($campaign_data->published_at));

        for ($i = 0; $i < count($email_array); ++$i) {
            if ($i <= $email_send_limit) {
                $params = array(
                    'html_email' => $html_email,
                    'plain_text_email' => $plain_text_email,
                    'email' => trim($email_array[ $i ]),
                    'subject' => $subject,
                    'user' => Auth::user(),
                    'campaign_name' => $campaign_data->campaign_name,
                    'published_at' => $published_at
                );

                Mail::send(
                    'emails.preview',
                    $params,
                    function ($message) use ($params) {
                        $message->from(
                            env('MAIL_FROM_ADDRESS', 'preview@stensul.com'),
                            env('MAIL_FROM_ADDRESS_NAME', 'Preview email')
                        )
                            ->to($params['email'])
                            ->subject(env('MAIL_PREVIEW_SUBJECT', $params['subject']));

                        $message->attachData(
                            $params['html_email'],
                            env('PREVIEW_HTML_FILE_NAME', 'preview_email') . "_" . date("m_d_y") . ".html",
                            []
                        );

                        if ($params['plain_text_email']) {
                            $message->attachData(
                                $params['plain_text_email'],
                                env('PREVIEW_TEXT_FILE_NAME', 'preview_email') . "_" . date("m_d_y") . ".txt",
                                []
                            );
                        }
                    }
                );

                Activity::log(
                    'Campaign email send try',
                    array('properties' => ['campaign_id' => new ObjectID($campaign_id),
                    'email' => $email])
                );

                $response['processed'][] = $email_array[$i];
            }
        }

        return $response;
    }

    /**
     * Send an approvals notification email.
     *
     * @param  Stensul\Models\User  $user  To send notification
     * @param  Stensul\Models\Proof $proof Related proof
     * @param  string               $type  Type of notification
     * @param  array                $data  Any required data
     * @return array Response
     */
    public static function sendApprovalsEmail(User $user, Proof $proof, $type, $data = [])
    {
        if (!isset($user->email)) {
            return ['error' => 'invalid email'];
        }

        switch ($type) {
            case 'new_proof':
                $email_layout = 'emails.proof.new_proof';
                $subject = sprintf('Review Request: %s (from %s)',
                    $proof->campaign->campaign_name,
                    $data['requestor']
                );
                $data['notification_message'] = isset($data['reviewer']['notification_message'])
                	? $data['reviewer']['notification_message']
                	: '';
                break;
            case 'deleted_proof':
                $email_layout = 'emails.proof.deleted_proof';
                $subject = sprintf('The email "%s" has been deleted, and your feedback is no longer needed.',
                    $proof->campaign->campaign_name
                );
                break;
            case 'new_comment':
                $email_layout = 'emails.proof.new_comment';
                $subject = sprintf('New Comment Received: %s, from %s',
                    $proof->campaign->campaign_name,
                    $data['comment']->user->fullname
                );
                break;
            case 'proof_approved':
                $email_layout = 'emails.proof.proof_approved';
                $subject = sprintf('Email Approved: %s, by %s',
                    $proof->campaign->campaign_name,
                    $data['reviewer_data']->fullname
                );
                break;
            case 'proof_fully_approved':
                $email_layout = 'emails.proof.proof_fully_approved';
                $subject = sprintf('Email Approved and Ready to Complete: %s',
                    $proof->campaign->campaign_name
                );
                break;
            case 'proof_rejected':
                $email_layout = 'emails.proof.proof_rejected';
                $subject = sprintf('Email Rejected: %s, by %s',
                    $proof->campaign->campaign_name,
                    $data['reviewer_data']->fullname
                );
                break;
        }

        $params = [
            'params' => $data,
            'email' => $user->email,
            'user' => $user,
            'proof' => $proof,
            'from_name' => config('proof.email.from_name'),
            'from_email' => config('proof.email.from_email'),
            'subject' => $subject
        ];

        Mail::send(
            $email_layout,
            $params,
            function ($message) use ($params) {
                $message->from(
                    $params['from_email'],
                    $params['from_name']
                )
                    ->to($params['email'])
                    ->subject($params['subject']);
            }
        );

        if (count(Mail::failures()) > 0) {
            \Log::error(sprintf(
                "Failed to send email (%s) to a user %s. [proof %s]",
                $type,
                $user->email,
                $proof->_id
            ));
            return false;
        }

        Activity::log('Email sent to user', [
            'properties' => [
                'proof_id' => new ObjectID($proof->_id),
                'email' => $user->email,
                'type' => $type
            ]
        ]);

        return true;
    }
}
