/*
 | ==================================================================
 |  Proof Library
 | ==================================================================
 |
 | This file contains all the functionality regarding Proof.
 |
 | Dependencies: jQuery
 |
 | ------------------------------------------------------------------
 */

var Application = Application || {};

Application.proof = (function($) {

    var $modalContainer = null;

    var initialized = false;

    var _this = this;

    var options = {
        domSelector: document,
        formSelector: '#send-proof-form',
        messageModalSelector: '#modal-proof-message',
        modalSelector: '#modal-send-proof',
        trackModalSelector: '#modal-track-proof',
        openModalSelector: '.proof-open-modal',
        openTrackModalSelector: '.proof-track-modal'
    };

    /**
     * Message modal
     */
    this.messageModal = {
        /**
         * Options inside message modal
         */
        options: {
            addMessageSelector: '#btn-proof-message',
            cancelSelector: '.btn-cancel',
            currentRowSelector: 'input[name="proof-current-row"]',
            messageSelector: 'textarea[name="notification_message"]'
        },

        /**
         * Message modal container
         */
        container: null,

        /**
         * Initialize modal to add messages
         *
         * @return {void}
         */
        init: function($modal) {
            if ($modal.find(options.messageModalSelector).length === 0) {
                return false;
            }

            _this.messageModal.container = $modal.find(options.messageModalSelector);

            // -- Bind submit --
            _this.messageModal.container.on('click', _this.messageModal.options.addMessageSelector, function() {
                var currentRow = _this.messageModal.container.find(_this.messageModal.options.currentRowSelector).val();
                var message = _this.messageModal.container.find(_this.messageModal.options.messageSelector).val() || '';
                $modalContainer.find('tr[data-row="' + currentRow + '"]').find('.notification_message').val(message);
                _this.messageModal.closeModal();
            });

            // -- Bind cancel --
            _this.messageModal.container.on('click', _this.messageModal.options.cancelSelector, function() {
                _this.messageModal.closeModal();
                return false;
            });
        },

        /**
         * Open a modal where the user can insert a message
         * for one specific reviewer
         *
         * @param  {object} elem
         * @return {void}
         */
        openModal: function( elem ) {
            // Set current row
            var currentRow = $( elem ).parents('tr').data('row');
            _this.messageModal.container.find(_this.messageModal.options.currentRowSelector).val(currentRow);

            // Set current message
            var currentMessage = $( elem ).siblings('.notification_message').val();
            _this.messageModal.container.find(_this.messageModal.options.messageSelector).val(currentMessage);

            // Show modal
            _this.messageModal.container.modal();

            // Set cursor
            _this.messageModal.container.find(_this.messageModal.options.messageSelector).focus();
        },

        /**
         * Close message modal
         *
         * @return {void}
         */
        closeModal: function() {
            _this.messageModal.container.modal('hide');
        }
    };

    /**
     * Track modal
     */
    this.trackModal = {

        options: {
            campaignIdSelector: 'input[name="campaign_id"]',
            campaignNameSelector: '.proof-campaign-name',
            commentsModalContainer: '#modal-proof-comments',
            openCommentsModalSelector: '.list-comments',
            tokenSelector: 'input[name="proof_token"]',
            trackTableSelector: '#track-table',
        },

        container: null,

        commentsContainer: null,

        /**
         * Initialize track modal
         *
         * @return {void}
         */
        init: function() {
            if ($(options.domSelector).find(options.trackModalSelector).length === 0) {
                return false;
            }

            _this.trackModal.container = $(options.domSelector).find(options.trackModalSelector);
            _this.trackModal.commentsContainer = $(options.domSelector).find(_this.trackModal.options.commentsModalContainer);

            // -- Bind open track modal --
            $(options.domSelector).on('click', options.openTrackModalSelector, function() {
                _this.trackModal.openModal( this );
                return false;
            });

            // -- Bind list comments modal --
            _this.trackModal.container.on('click', _this.trackModal.options.openCommentsModalSelector, function() {
                _this.trackModal.openCommentsModal( this );
                return false;
            });

            // -- Bind list comments cancel --
            _this.trackModal.commentsContainer.on('click', '.btn-cancel', function() {
                _this.trackModal.commentsContainer.modal('hide');
                return false;
            });
        },

        /**
         * Open track modal
         *
         * @param  {object} elem
         * @return {void}
         */
        openModal: function( elem ) {
            // Add campaign id
            var campaignId = $(elem).data('campaign-id');

            if (campaignId) {
                // Show modal
                _this.trackModal.cleanModal();
                _this.trackModal.container.modal();

                _this.getCampaignData(campaignId, function(data) {
                    _this.trackModal.container.find(_this.trackModal.options.campaignIdSelector).val( campaignId );
                    _this.trackModal.container.find(_this.trackModal.options.campaignNameSelector).html( $(elem).data('campaign-name') );
                    _this.trackModal.container.find(_this.trackModal.options.tokenSelector).val( data.token );

                    // Get reviewers
                    _this.getReviewers( elem, campaignId, function(response) {
                        if (response && response.status === 'success') {
                            var $table = _this.trackModal.getTrackTable();
                            $table.html('');
                            $.each(response.data, function(k, v) {
                                _this.trackModal.addReviewerToTrack(v.email, v);
                            });
                        }
                    });
                });
            }
        },

        /**
         * Open a modal with comments from a selected reviewer
         *
         * @param  {object} elem
         * @return {void}
         */
        openCommentsModal: function( elem ) {
            var token = _this.trackModal.container.find(_this.trackModal.options.tokenSelector).val();
            var email = $( elem ).parents('tr').data('email');

            if (token && email) {
                // Get comments
                var getComments = Application.utils.doAjax("/proof/comments/" + token, {
                    type: 'GET',
                    data: {
                        email: email
                    }
                });

                getComments.done(function( response ){
                    var $container = _this.trackModal.container.find('.track-proof');
                    if (response.status === 'success') {
                        if (response.data.comments.length > 0 && 'requested_user_count' in response.data
                            && response.data.requested_user_count > 0) {
                            var list = _this.trackModal.commentsContainer.find('#comments-table tbody');
                            var html = '';
                            $.each(response.data.comments, function(k, v) {
                                html += '' +
                                    '<tr>' +
                                        '<td width="180">' + v.display_name + '<br><small>' + v.created_at + '</small></td>' +
                                        '<td style="background: #f9f9f9;">' + v.content + '</td>' +
                                    '</tr>'
                            });
                            list.html(html);
                            _this.trackModal.commentsContainer.modal();
                        }
                    } else {
                        _this.showMessage($container, 'danger', response.message);
                    }
                });

                getComments.always(function(){
                    _this.hideButtonSpinner( elem );
                });
            }
        },

        /**
         * Add a reviewer to the track's table
         *
         * @param  {string} email
         * @param  {array}  params
         * @return {void}
         */
        addReviewerToTrack: function( email, params ) {
            var $table = _this.trackModal.getTrackTable();

            var required = params.required ? 'style="font-weight:bold;"' : '';

            var decision = '-';

            if ("decision" in params) {
                switch (params.decision) {
                    case 'approve':
                    case 'approve-with-comments':
                        decision = 'Approved';
                        break;
                    case 'reject':
                    case 'reject-with-comments':
                        decision = 'Rejected';
                        break;
                }
            }

            var comment = '';
            if ("comment" in params) {
                comment = params.comment;
            }

            var html = '' +
                '<tr data-email="' + email + '">' +
                    '<td ' + required + '>' + email + '</td>' +
                    '<td>' + decision + '</td>' +
                    '<td>' + params.last_modified_date + '</td>' +
                    '<td>' + comment + '</td>' +
                '</tr>';

            $table.append(html);
        },

        /**
         * Clean proof modal
         *
         * @return {void}
         */
        cleanModal: function() {
            // Clean table
            var $table = _this.trackModal.getTrackTable();
            $table.html('<tr><td colspan="3" class="text-center"><img src="'+Application.globals.imageUrl+'ajax-loader.gif" class="spinner-small"/></td></tr>');
        },

        /**
         * Return track table element
         *
         * @return {object}
         */
        getTrackTable: function() {
            return _this.trackModal.container.find(_this.trackModal.options.trackTableSelector + ' tbody');
        }
    };

    /**
     * Proof modal
     */
    this.modal = {

        options: {
            addReviewerSelector: '.btn-reviewer-add',
            campaignIdSelector: 'input[name="campaign_id"]',
            createProofCheckboxSelector: '.new-proof-checkbox',
            createProofSelector: 'input[name="create_new_proof"]',
            openMessageModalSelector: '.add-message',
            proofIdSelector: 'input[name="proof_id"]',
            sendToAllSelector: 'input[name="send_to_all"]',
            removeReviewerSelector: '.remove-reviewer',
            reviewersTableSelector: '#reviewers-table',
            selectReviewerSelector: 'select[name="proof_users"]',
            sendProofSelector: '#btn-send-proof',
            usersPickerSelector: '.proof-users-picker'
        },

        /**
         * Initialize proof modal
         *
         * @return {void}
         */
        init: function() {
            if ($(options.domSelector).find(options.modalSelector).length) {
                $modalContainer = $(options.domSelector).find(options.modalSelector);

                // -- Init proof users picker --
                if ($modalContainer.find(_this.modal.options.usersPickerSelector).length) {
                    $modalContainer.find(_this.modal.options.usersPickerSelector).selectpicker();
                }

                // -- Bind add reviewer --
                if ($modalContainer.find(_this.modal.options.addReviewerSelector).length) {
                    $modalContainer.on('click', _this.modal.options.addReviewerSelector, function() {
                        var email = $modalContainer.find(_this.modal.options.selectReviewerSelector + ' option:selected').text();
                        _this.modal.addReviewer( email );
                        return false;
                    });
                }

                // -- Bind open modal --
                $(options.domSelector).on('click', options.openModalSelector, function() {
                    _this.modal.openModal( this );
                    return false;
                });

                // -- Bind remove reviewer --
                $modalContainer.on('click', _this.modal.options.removeReviewerSelector, function() {
                    _this.modal.removeReviewer( this );
                    return false;
                });

                // -- Bind send proof --
                if ($modalContainer.find(_this.modal.options.sendProofSelector).length) {
                    $modalContainer.on('click', _this.modal.options.sendProofSelector, function() {
                        _this.sendProof( this );
                        return false;
                    });
                }

                // Init message modal
                _this.messageModal.init($modalContainer);

                // -- Bind add message --
                $modalContainer.on('click', _this.modal.options.openMessageModalSelector, function() {
                    _this.messageModal.openModal( this );
                    return false;
                });
            }
        },

        /**
         * Open a modal to prepare and send a proof
         *
         * @param  {object} elem
         * @return {void}
         */
        openModal: function( elem ) {
            if( $modalContainer ){
                // Add campaign id
                var campaignId = $( elem ).data('campaign-id');

                // Show modal
                _this.modal.cleanModal();
                $modalContainer.modal();

                var submitButton = $modalContainer.find(_this.modal.options.sendProofSelector);
                submitButton.attr("disabled","disabled");

                var addButton = $modalContainer.find(_this.modal.options.addReviewerSelector);
                addButton.attr("disabled","disabled");

                _this.getCampaignData(campaignId, function(data) {
                    $modalContainer.find(_this.modal.options.campaignIdSelector).val(campaignId);
                    if ("proof_id" in data && data.proof_id !== null) {
                        $modalContainer.find(_this.modal.options.proofIdSelector).val(data.proof_id);
                        $modalContainer.find(_this.modal.options.createProofCheckboxSelector).show();
                        $modalContainer.find(_this.modal.options.createProofSelector).prop('checked', false);
                    } else {
                        $modalContainer.find(_this.modal.options.createProofCheckboxSelector).hide();
                        $modalContainer.find(_this.modal.options.createProofSelector).prop('checked', true);
                    }

                    $modalContainer.find(_this.modal.options.sendToAllSelector).prop('checked', false);

                    // Get reviewers
                    _this.getReviewers( elem, campaignId, function(response) {
                        var $table = _this.modal.getReviewersTable();
                        $table.html('');
                        if (response && response.status === 'success') {
                            $.each(response.data, function(k, v) {
                                _this.modal.addReviewer(v.email, v);
                            });
                        }
                        submitButton.removeAttr("disabled","disabled");
                        addButton.removeAttr("disabled","disabled");
                    });
                });
            }
        },

        /**
         * Clean proof modal
         *
         * @return {void}
         */
        cleanModal: function() {
            // Hide checkbox
            $modalContainer.find(_this.modal.options.createProofCheckboxSelector).hide();
            // Clean table
            var $table = _this.modal.getReviewersTable();
            $table.html('<tr><td colspan="3" class="text-center"><img src="'+Application.globals.imageUrl+'ajax-loader.gif" class="spinner-small"/></td></tr>');
        },

        /**
         * Add a reviewer in the table
         *
         * @param  {string} email
         * @param  {array}  params
         * @return {void}
         */
        addReviewer: function( email, params ) {
            var $table = _this.modal.getReviewersTable();

            // Check if the email already exists in the table
            var check = $table.find('tr > td:contains(' + email + ')').length;

            if (!check) {
                var i = $table.find('tr:last').data('row') + 1 || 0;

                // Set default params
                params = $.extend({
                    required: '',
                    notification_message: ''
                }, params );

                var requiredChecked = params.required ? 'checked="checked"' : '';
                var requiredValue = ' value="1"';
                var requiredDisable = '';
                var notification_message = params.notification_message || '';

                if ("require_unabled" in params) {
                    requiredValue = ' value="0"';
                    requiredDisable = ' disabled="disabled"';
                }

                var html = '' +
                    '<tr data-row="' + i + '">' +
                        '<td>' +
                            '<input type="hidden" name="reviewers[' + i + '][email]" value="' + email + '">' +
                            email +
                        '</td>' +
                        '<td>' +
                            '<input type="checkbox" name="reviewers[' + i + '][required]"' + requiredChecked +
                                requiredValue + requiredDisable + '>' +
                        '</td>' +
                        '<td>' +
                            '<input type="hidden" name="reviewers[' + i + '][notification_message]" value="' + notification_message + '" class="notification_message">' +
                            '<a href="#" class="' + _this.modal.options.openMessageModalSelector.substring(1) + '" title="Add a message">' +
                                '<i class="glyphicon glyphicon-envelope"></i></a>' +
                            '<a href="#" class="' + _this.modal.options.removeReviewerSelector.substring(1) + '" title="Remove this email">' +
                                '<i class="glyphicon glyphicon-remove"></i></a>' +
                        '</td>' +
                    '</tr>';
                $table.append(html);
            } else {
                // The email already exists in the table
                var $container = $modalContainer.find('.send-proof');
                _this.showMessage($container, 'danger', 'This email already exists on the list.');
            }
        },

        /**
        * Remove a reviewer from the table
        *
        * @param  {object} elem
        * @return {void}
        */
        removeReviewer: function( elem ) {
            if (confirm('Are you sure you want to remove this email?')) {
                $( elem ).closest("tr").remove();
            }
        },

        /**
         * Return reviewers table element
         *
         * @return {object}
         */
        getReviewersTable: function() {
            return $modalContainer.find(_this.modal.options.reviewersTableSelector + ' tbody');
        }
    };

    /**
     * Get a list of reviewers in the current proof
     *
     * @param  {object}   elem
     * @param  {string}   campaignId
     * @param  {callback} callback
     * @return {void}
     */
    this.getReviewers = function( elem, campaignId, callback ) {
        var getReviewers = Application.utils.doAjax("/proof/reviewers/" + campaignId, {
            type: 'GET'
        });

        getReviewers.done(function( response ) {
            if (callback) {
                callback( response );
            }
        });

        getReviewers.always(function(){
            // TODO: add spinner
        });
    };

    /**
     * Get campaign data
     *
     * @param  {string}   campaignId
     * @param  {callback} callback
     * @return {void}
     */
    this.getCampaignData = function( campaignId, callback ) {
        var getCampaign = Application.utils.doAjax("/proof/campaign/" + campaignId, {
            type: 'GET'
        });

        getCampaign.done(function( response ) {
            if (response && response.status === 'success') {
                if (callback) {
                    callback(response.data);
                }
            }
        });
    };

    /**
     * Show a message inside the modal
     *
     * @param  {object}  container
     * @param  {string}  status
     * @param  {string}  message
     * @param  {integer} delay
     * @return {void}
     */
    this.showMessage = function( container, status, message, delay ) {
        var errorAlert = '<div class="alert alert-' + status + '" role="alert" style="display:none;">' + message + '</div>';

        // First remove any previous alert
        $modalContainer.find('.alert:hidden').remove();

        // Show if not exist a visible alert
        if (!container.find('.alert').length) {
            container.prepend(errorAlert).find(".alert").slideDown();
            setTimeout(function() {
                container.find('.alert')
                    .slideUp('normal', function() {
                        $(this).remove();
                    });
            }, delay || 4000);
        }
    };

    /**
     * Show button spinner
     *
     * @param  {object} elem
     * @return {void}
     */
    this.showButtonSpinner = function( elem ) {
        $( elem ).addClass("ajax-loader-small").attr("disabled","disabled");
        $( elem ).parent().removeClass("success").addClass("spinner");
    };

    /**
     * Hide button spinner
     *
     * @param  {object} elem
     * @return {void}
     */
    this.hideButtonSpinner = function( elem ) {
        $( elem ).parent().removeClass("spinner");
        $( elem ).removeClass("ajax-loader-small").removeAttr("disabled","disabled");
    };

    /**
     * Send a request to create a proof
     *
     * @param  {object} elem
     * @return {void}
     */
    this.sendProof = function( elem ) {
        _this.showButtonSpinner( elem );

        if (typeof Application.utils.getConfigurationForm === 'function' && Application.utils.getConfigurationForm()) {
            // We are in the editor, save campaign
            var saveCampaign = campaignManager.save({saveHtml: true, validateForms: true});
            var $container = $modalContainer.find('.send-proof');

            // Show validation error message
            if (!saveCampaign) {
                _this.showMessage($container, 'danger', Application.globals.campaignValidationError, 8000);
                _this.hideButtonSpinner( elem );
                return false;
            }

            // On save Success
            saveCampaign.done(function (campaignId) {
                _this.ajaxProof( elem );
            });

            // On save Fail
            saveCampaign.fail(function () {
                _this.hideButtonSpinner( elem );
                _this.showMessage($container, 'danger', 'An error occurred while trying to save the campaign, please try again later.');
            });
        } else {
            // We are in the dashboard
            _this.ajaxProof( elem );
        }
    };

    /**
     * Do an ajax call to upload the proof
     *
     * @param  {object} elem
     * @return {void}
     */
    this.ajaxProof = function( elem ) {
        _this.showButtonSpinner( elem );

        var data = $modalContainer.find(options.formSelector).serialize();

        var sendProof = Application.utils.doAjax("/proof/create", {
            type: 'POST',
            data: data
        });

        sendProof.done(function( response ){
            if (response.status === 'success') {
                // If the campaign can't be completed, hide the Continue button
                if ("can_be_completed" in response.data) {
                    if (response.data.can_be_completed) {
                        $('.campaign-continue').show();
                    } else {
                        $('.campaign-continue').hide();
                    }
                }
                $modalContainer.modal('hide');
                Application.utils.alert.display('Success!', response.message, "success");
            } else {
                var $container = $modalContainer.find('.send-proof');
                _this.showMessage($container, 'danger', response.message);
            }
        });

        sendProof.always(function(){
            _this.hideButtonSpinner( elem );
        });
    };

    /**
     * Do some initial checks
     *
     * @return {void}
     */
    this.initialChecks = function() {
        if (typeof Application.utils.getConfigurationForm === 'function'
            && Application.utils.getConfigurationForm()
            && $(options.openModalSelector).length > 0
        ) {
            var campaignId = campaignManager.getCampaignId();
            this.getCampaignData(campaignId, function(data) {
                if ("can_be_processed" in data && data.can_be_processed === false) {
                    Application.utils.alert.display('', data.alert, "warning");
                }
            });
        }
    };

    /**
     * Init Application Proof Library
     * @param  {array} params
     * @return {void}
     */
    this.init = function( params ){
        if (!_this.initialized) {

            // -- Update options --
            options = $.extend( options, params );

            // -- Init track modal --
            this.trackModal.init();

            // -- Initial checks --
            $(document).ready(function() {
                _this.initialChecks();
            });

            // -- Init modal --
            this.modal.init();
            if (!$modalContainer) {
                return false;
            }
        }

        _this.initialized = true;
    };

    this.init();

})(jQuery);
