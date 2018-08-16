<?php

namespace Stensul\Http\Controllers;

use Auth;
use Activity;
use Carbon\Carbon;
use RoleModel as Role;
use UserModel as User;
use ProofModel as Proof;
use CommentModel as Comment;
use CampaignModel as Campaign;
use Illuminate\Http\Request;
use SendReviewersEmail;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use MongoDB\BSON\ObjectID as ObjectID;
use MongoDB\BSON\UTCDateTime;

class ProofController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Proof Controller
    |--------------------------------------------------------------------------
    |
    | This controller contain everything regarding proof functionality.
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('acl.permission:access_proof');

        if (!\Config::get('proof.status')) {
            abort(401, 'Not available.');
        }
    }

    /**
     * Show proof.
     *
     * @param  Request $request
     * @param  String  $token
     * @return View
     */
    public function getReview(Request $request, $token)
    {
        // Get proof by given token
        $proof = Proof::whereToken($token)->first();

        // Validate
        if (!$proof || !$proof->userCanAccess(Auth::id())) {
            return redirect(env('APP_BASE_URL', '/'));
        }

        // Validate if the proof is available
        if ($proof->status === Proof::STATUS_DELETED) {
            // Check if there's a new version of the proof and if the current user has access to it
            if (isset($proof->campaign->proof_id)) {
                $new_proof = Proof::find($proof->campaign->proof_id);
                if ($new_proof && $proof->id !== $new_proof->id && $new_proof->userCanAccess(Auth::id())) {
                    // Current user has access to the new proof, redirect and show message
                    $request->session()->put(
                        'proof.review.message',
                        'This email has been altered since your feedback was requested. '
                        . 'Below is the most recent content.'
                    );
                    return redirect(url('proof/review', $new_proof->token));
                }
            }

            $request->session()->flash(
                'error_message',
                'This email has been deleted, and your feedback is no longer needed.'
            );
            return redirect(url('error'));
        }

        // Check if it is the first visit
        $updated = false;
        foreach ($proof->reviewers as $reviewer) {
            if ($reviewer['email'] === Auth::user()->email) {
                if (!isset($reviewer['opened_at'])) {
                    $date = new UTCDateTime();
                    $reviewer['opened_at'] = $date->toDateTime();
                    Activity::log('Reviewer opened a proof', [
                        'properties' => [
                            'proof_id' => new ObjectId($proof->id),
                            'user_id' => new ObjectId(Auth::id())
                        ]
                    ]);
                    $updated = true;
                }
            }
            $reviewers[] = $reviewer;
        }

        if ($updated) {
            $proof->reviewers = $reviewers;
            $proof->save();
        }

        $params = [
            'header_title' => $proof->campaign->campaign_name,
            'token' => $token,
            'libraries' => Auth::user()->getLibraries()
        ];

        return $this->renderView('proof', ['params' => $params]);
    }

    /**
     * Get data about the current proof.
     *
     * @param  Request $request
     * @param  String  $token
     * @return Json
     */
    public function getData(Request $request, $token)
    {
        // Get proof by given token
        $proof = Proof::whereToken($token)->first();

        // Validate
        if (!$proof || !$proof->userCanAccess(Auth::id())) {
            return abort(401, 'Unauthorized.');
        }

        $params = [];

        $current_reviewer = [];
        $params['show_decision'] = true;
        $params['can_edit'] = false;
        $params['campaign_finished'] = false;

        if(isset($proof->campaign->processed) && $proof->campaign->processed==1){
            $params['show_decision'] = false;
            $params['campaign_finished'] = true;
        }
        // Validate if current logged user is a reviewer
        foreach ($proof->reviewers as $reviewer) {
            if ($reviewer['email'] === Auth::user()->email) {
                $current_reviewer = $reviewer;
            }
        }

        // Validate if current logged user is the requestor, if not, hide decision buttons
        if (!$current_reviewer) {
            $params['show_decision'] = false;
        }

        // Validate if the user can edit the campaign
        if (Auth::user()->can('edit_campaign')) {
          if(!isset($proof->campaign->processed) || $proof->campaign->processed==0)
            $params['can_edit'] = true;
        }

        $params['reviewer'] = $current_reviewer;

        $params['campaign'] = [
            '_id' => $proof->campaign->_id,
            'body_html' => $proof->campaign->body_html,
            'template_width' => $proof->campaign->getLibraryConfig('templateWidth'),
            'template_mobile_width' => $proof->campaign->getLibraryConfig('templateMobileWidth')
        ];

        $params['locales'] = \Config::get('locales');

        if ($request->session()->has('proof.review.message')) {
            $params['message'] = $request->session()->pull('proof.review.message');
        }

        return [
            'status' => 'success',
            'data' => $params
        ];
    }

    /**
     * Get a list of comments by a given proof.
     *
     * @param  Request $request
     * @param  String  $token
     * @return Json
     */
    public function getComments(Request $request, $token)
    {
        // Get proof by given token
        $proof = Proof::whereToken($token)->first();

        // Validate
        if (!$proof || !$proof->userCanAccess(Auth::id())) {
            return abort(401, 'Unauthorized.');
        }

        $data = [];

        $comments = $proof->comments();

        // If a reviewer's email exists in the params, return how many message wrote
        if ($request->has('email')) {
            $user_id = User::whereEmail($request->input('email'))->first()->id;
            $data['requested_user_count'] = $proof->comments()->whereUserId($user_id)->count();
        }

        $data['comments'] = array_map(function ($comment) {
            $comment['display_name'] = User::find($comment['user_id'])->name;
            $comment['created_at'] = Carbon::parse($comment['created_at'])->format('F jS, Y | h:i A');
            unset($comment['user_id'], $comment['_id'], $comment['proof_id']);
            return $comment;
        }, $comments->get()->toArray());

        return [
            'status' => 'success',
            'data' => $data
        ];
    }

    /**
     * Post a new comment.
     *
     * @param  Request $request
     * @param  String  $token
     * @return Json
     */
    public function postComment(Request $request, $token)
    {
        // Get proof by given token
        $proof = Proof::whereToken($token)->first();

        // Validate
        if (!$proof || !$proof->userCanAccess(Auth::id())) {
            return abort(401, 'Unauthorized.');
        }

        $comment = Comment::create([
            'proof_id' => $proof->id,
            'user_id' => Auth::id(),
            'content' => $request->comment
        ]);

        if ($comment) {
            Activity::log('Proof received a comment', [
                'properties' => [
                    'proof_id' => new ObjectId($proof->id),
                    'user_id' => new ObjectId(Auth::id()),
                    'comment_id' => new ObjectId($comment->id)
                ]
            ]);

            return [
                'status' => 'success',
                'data' => $comment
            ];
        }

        return [
            'status' => 'error',
            'message' => 'An error has occurred. Please try again or contact us at ' . \Config::get('mail.from.address')
        ];
    }

    /**
     * Save a reviewer decision for a given proof.
     *
     * @param  Request $request
     * @param  String  $token
     * @return Json
     */
    public function postDecision(Request $request, $token)
    {
        $decision = $request->get('decision');

        // Get proof by given token
        $proof = Proof::whereToken($token)->first();

        // Validate
        if (!$proof || !$proof->userCanAccess(Auth::id()) || !$decision) {
            return abort(401, 'Unauthorized.');
        }

        $updated = false;

        // Validate current logged user is a reviewer
        $reviewers = [];
        foreach ($proof->reviewers as $reviewer) {
            if ($reviewer['email'] === Auth::user()->email) {
                $reviewer['decision'] = $decision;
                $date = new UTCDateTime();
                $reviewer['decision_at'] = $date->toDateTime();
                if ($request->has('comment') && strlen($request->input('comment')) > 0) {
                    // Store the decision comments
                    $comment = Comment::create([
                        'proof_id' => $proof->id,
                        'user_id' => Auth::id(),
                        'content' => $request->get('comment'),
                        'decision' => $decision
                    ]);
                    // Relate the comment with the decision
                    $reviewer['decision_comment'] = new ObjectId($comment->id);
                }
                // If a reviewer is required, but has already supplied approval, it should no longer be required
                if (strpos('approve', $reviewer['decision'])) {
                    unset($reviewer['required']);
                    $reviewer['require_unabled'] = true;
                }
                $updated = true;
            }
            $reviewers[] = $reviewer;
        }

        if ($updated) {
            $proof->reviewers = $reviewers;
            $proof->save();

            Activity::log('Reviewer took a decision', [
                'properties' => [
                    'proof_id' => new ObjectId($proof->id),
                    'user_id' => new ObjectId(Auth::id()),
                    'decision' => $decision,
                    'comment' => $request->has('comment') && strlen($request->input('comment')) > 0 ? $comment->id : ''
                ]
            ]);

            return [
                'status' => 'success',
                'message' => 'Your decision has been saved.',
                'data' => [
                    'proof_id' => $proof->id
                ]
            ];
        }

        return [
            'status' => 'error',
            'message' => 'An error has occurred. Please try again or contact us at ' . \Config::get('mail.from.address')
        ];
    }

    /**
     * Delete a reviewer's decision for a given proof.
     *
     * @param  String  $token
     * @return Json
     */
    public function postDeleteDecision($token)
    {
        // Get proof by given token
        $proof = Proof::whereToken($token)->first();

        // Validate
        if (!$proof || !$proof->userCanAccess(Auth::id())) {
            return abort(401, 'Unauthorized.');
        }

        // Validate current logged user is a reviewer
        $reviewers = [];
        foreach ($proof->reviewers as $reviewer) {
            if ($reviewer['email'] === Auth::user()->email) {
                if (isset($reviewer['decision_comment'])) {
                    $comment = Comment::find($reviewer['decision_comment']);
                    if ($comment) {
                        $comment->unset('decision');
                        $comment->save();
                    }
                }
                // Remove decision data from this reviewer
                $decision = $reviewer['decision'];
                $decision_at = $reviewer['decision_at'];
                $decision_comment = isset($reviewer['decision_comment']) ? $reviewer['decision_comment'] : '';
                unset($reviewer['decision'], $reviewer['decision_at'], $reviewer['decision_comment']);
                $updated = true;
            }
            $reviewers[] = $reviewer;
        }

        if ($updated) {
            $proof->reviewers = $reviewers;
            $proof->save();

            Activity::log('Reviewer undone a decision', [
                'properties' => [
                    'proof_id' => new ObjectId($proof->id),
                    'user_id' => new ObjectId(Auth::id()),
                    'previous_decision' => isset($decision) ? $decision : '',
                    'previous_decision_at' => isset($decision_at) ? $decision_at : '',
                    'previous_decision_comment' => isset($decision_comment) ? $decision_comment : ''
                ]
            ]);

            return [
                'status' => 'success',
                'message' => 'Your decision has been undone.',
                'data' => [
                    'proof_id' => $proof->id
                ]
            ];
        }

        return [
            'status' => 'error',
            'message' => 'An error has occurred. Please try again or contact us at ' . \Config::get('mail.from.address')
        ];
    }

    /**
     * Create a new proof.
     *
     * @param  Request $request
     * @return Json
     */
    public function postCreate(Request $request)
    {
        $campaign_id = $request->input('campaign_id');
        $reviewers = $request->input('reviewers');

        if (!$campaign_id || !$reviewers) {
            throw new BadRequestHttpException("You must provide 'campaign_id' and 'reviewers' parameters.");
        }

        if (!Auth::user()->can('edit_proof')) {
            return abort(401, 'Unauthorized.');
        }

        // Update reviewers
        foreach ($reviewers as $key => $value) {
            $reviewers[$key]['user_id'] = new ObjectId(User::whereEmail($value['email'])->first()->id);
        }

        // Check if we have to create a new proof, or update the current one
        if ($request->has('create_new_proof')) {
            // Generate a token
            $token = md5(uniqid() . $campaign_id);

            // Create proof
            $proof = Proof::create([
                'campaign_id' => $campaign_id,
                'requestor' => new ObjectId(Auth::id()),
                'token' => $token,
                'status' => Proof::STATUS_PROCESSED,
                'reviewers' => $reviewers
            ]);
            $activity = 'Proof created';

            // Mark as deleted any previous proof
            if ($proof) {
                $campaign = Campaign::find($campaign_id);
                if (isset($campaign->proof_id)) {
                    // Find the previous proof
                    $old_proof = Proof::find($campaign->proof_id);
                    if ($old_proof) {
                        $old_proof->status = Proof::STATUS_DELETED;
                        $old_proof->save();

                        // Set the previous proof id in the new one
                        $proof->previous_proof = new ObjectId($old_proof->id);
                        $proof->save();
                    }
                }
            }
        } else {
            $proof = Proof::find($request->input('proof_id'));

            foreach ($reviewers as $key => $reviewer) {
                foreach ($proof->reviewers as $current_reviewer) {
                    if ($reviewer['email'] === $current_reviewer['email']) {
                        if ($reviewer['notification_message'] !== $current_reviewer['notification_message']) {
                            /*
                             * If the notification message was updated,
                             * the reviewer should receive the notification again
                             */
                            unset($current_reviewer['notified'], $current_reviewer['notified_at']);
                        }
                        unset($current_reviewer['notification_message']);
                        $reviewers[$key] = array_merge($reviewers[$key], $current_reviewer);

                        if (isset($reviewer['required']) && $reviewer['required'] == 1) {
                            $reviewers[$key]['required'] = 1;
                        } else {
                            $reviewers[$key]['required'] = 0;
                        }
                    }
                }
            }

            $proof->reviewers = $reviewers;
            $proof->requestor = new ObjectId(Auth::id());

            if ($request->has('send_to_all') && $request->input('send_to_all') == 1) {
                $proof->send_to_all = true;
            }
            $proof->save();
            $activity = 'Proof updated';
        }

        if ($proof) {
            Activity::log($activity, [
                'properties' => [
                    'proof_id' => new ObjectId($proof->id),
                    'user_id' => new ObjectId(Auth::id())
                ]
            ]);

            // Update current proof id in campaign
            $proof->campaign->proof_id = new ObjectId($proof->id);
            $proof->campaign->save();

            // Send emails to reviewers
            dispatch(new SendReviewersEmail($proof, 'new_proof'));

            return [
                'status' => 'success',
                'message' => 'Your email is being prepared for review and notifications will be sent to your
                    chosen reviewers within a couple of minutes.',
                'data' => [
                    'proof_id' => $proof->id,
                    'can_be_completed' => $proof->campaign->can_be_processed
                ]
            ];
        }

        return [
            'status' => 'error',
            'message' => 'An error has occurred. Please try again or contact us at ' . \Config::get('mail.from.address')
        ];
    }

    protected function formatDate($utcdatetime)
    {
        $date = new \DateTime($utcdatetime['date'], new \DateTimeZone(isset($utcdatetime['timezone']) ? $utcdatetime['timezone'] : 'UTC'));
        $date->setTimezone(new \DateTimeZone(date_default_timezone_get()));
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * Get a list of reviewers by a given campaign id
     *
     * @SuppressWarnings("UnusedFormalParameter")
     * @param  Request $request
     * @param  String  $campaign_id
     * @return Json
     */
    public function getReviewers(Request $request, $campaign_id)
    {
        $campaign = Campaign::find($campaign_id);
        $proof = $campaign->getLastProof();
        $reviewers = [];

        if ($proof && count($proof->reviewers)) {
            $reviewers = array_map(function ($reviewer) use ($proof) {
                $reviewer['display_name'] = User::find($reviewer['user_id'])->name;
                if (isset($reviewer['decision'])) {
                    if (isset($reviewer['decision_comment'])) {
                        $reviewer['comment'] = Comment::find($reviewer['decision_comment'])->content;
                    }
                    $date = $this->formatDate($reviewer['decision_at']);
                } else {
                    $date = isset($reviewer['notified_at'])
                        ? $this->formatDate($reviewer['notified_at'])
                        : $proof->created_at->format('Y-m-d H:i:s');
                }
                $reviewer['last_modified_date'] = $date;
                unset($reviewer['user_id']);
                return $reviewer;
            }, $proof->reviewers);
        }

        return [
            'status' => 'success',
            'data' => $reviewers
        ];
    }

    /**
     * Get a list of available users to be used as reviewers.
     *
     * @return Json
     */
    public function getUsers()
    {
        // Ignore current user and deleted users
        $users = User::where('email', '!=', Auth::user()->email)->active();

        // Get roles that has access to approvals page (so users with these roles can be added as reviewers)
        $roles = Role::wherePermissions('access_proof')->get()->pluck(['name']);
        $users->whereIn('roles', $roles);

        if (!Auth::user()->hasRole('stensul-internal')) {
            // If logged user does not have stensul-internal role, we need to exclude users with this role
            $users->where('roles', '!=', 'stensul-internal');
        }

        return [
            'status' => 'success',
            'data' => $users->get()->pluck('email')
        ];
    }

    /**
     * Get campaign info.
     *
     * @SuppressWarnings("UnusedFormalParameter")
     * @param  Request $request
     * @param  String  $campaign_id
     * @return Json
     */
    public function getCampaign(Request $request, $campaign_id)
    {
        $campaign = Campaign::find($campaign_id);

        if ($campaign) {
            $data['id'] = $campaign->id;
            $data['can_be_processed'] = $campaign->can_be_processed;
            $data['proof_id'] = $campaign->proof_id ? (string) $campaign->proof_id : null;
            $token = null;

            if ($campaign->proof_id) {
                $proof = Proof::find($campaign->proof_id);
                $token = $proof->token;
            }
            $data['token'] = $token;

            if (!$campaign->can_be_processed) {
                $data['alert'] = 'The required reviewers have not all approved this message.
                    Resend your request to them on this page, or
                    <a href="#" class="proof-track-modal" data-campaign-id="' . $campaign_id .
                        '" data-campaign-name="' . $campaign->campaign_name . '">click here</a>
                    to track current approvals';
            }

            return [
                'status' => 'success',
                'data' => $data
            ];
        }

        return \Response::make("", 204);
    }
}
