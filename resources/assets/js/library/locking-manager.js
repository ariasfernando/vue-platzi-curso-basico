(function ( $ ) {
    campaignManager = campaignManager || {};
    campaignManager.lockingManager = new lockingManager();

    function lockingManager( params ){
        var options = $.extend({
            lockingContainerSelector: '#locking',
            lockButtonSelector: '.lock-campaign-btn',
            unlockButtonSelector: '.unlock-campaign-btn',
            spinnerSelector: '.unlock-campaign-btn',
            lockLabel: 'Lock',
            unlockLabel: 'Unlock'
        }, params);

        var locking = this;
        var $campaingConfigForm = null;
        var $lockingContainer = null;

        this.getCampaignConfigForm = function(){
            return Application.utils.getConfigurationForm();
        };

        this.init = function(){
            $campaingConfigForm = locking.getCampaignConfigForm();
            $lockingContainer = $campaingConfigForm.find(options.lockingContainerSelector);

            if(!$lockingContainer.length){
                return false;
            }

            // set button events
            locking.setEvents();
            // check campaign lock status
            locking.checklockingStatus();
        };

        // Set click events to lock and unlock buttons.
        this.setEvents = function(){
            $campaingConfigForm
                // Lock campaign button click
                .on('click', options.lockButtonSelector, function() {
                    // Start loading
                    locking.loadingStart($(this));
                    // Lock campaign
                    locking.forceLock(function() {
                        // Stop Loading
                        locking.loadingStop();
                        // Display unlock button
                        locking.displayUnlockBtn();
                        // Hide campaign action buttons
                        locking.hideCampaignButtons();
                        // Update locking button label
                        locking.updateLockingText(options.unlockLabel);
                    },
                    function() {
                        locking.loadingStop();
                    });
                    return false;
                })
                .on('click', options.unlockButtonSelector, function(){
                    // Start loading
                    locking.loadingStart($(this));
                    // Unlock campaign
                    locking.unlockForced(function() {
                        // Display block button.
                        locking.displayBlockBtn();
                        // Show campaign action buttons
                        locking.showCampaignButtons();
                        // Update locking button label
                        locking.updateLockingText(options.lockLabel);
                    },
                    function(event) {
                        locking.loadingStop();
                    });
                    return false;
                });
        };

        // Check locking status
        this.checklockingStatus = function(){
            // Disable config form if campaign is locked.
            if( locking.getLockingSatus() && locking.getLockingSatus() == 'locked' ){
                locking.disableConfigForm();
            }
        };

        this.loadingStart = function($button){
            $button
                .addClass('ajax-loader-small')
                .attr('disabled', 'disabled');
        };

        this.loadingStop = function(){
            $lockingContainer.find('.ajax-loader-small').removeClass('ajax-loader-small');
        };

        this.displayUnlockBtn = function(){
            $lockingContainer.find(options.lockButtonSelector)
                .addClass('hidden')
                .removeAttr('disabled');
            $lockingContainer.find(options.unlockButtonSelector)
                .removeAttr('disabled')
                .removeClass('hidden');
        };
        this.displayBlockBtn = function(){
            $lockingContainer.find(options.unlockButtonSelector)
                .addClass('hidden')
                .removeAttr('disabled');
            $lockingContainer.find(options.lockButtonSelector)
                .removeAttr('disabled')
                .removeClass('hidden');
        };

        // Hide campaign buttons when campaign is locked
        this.hideCampaignButtons = function(){
            $('.save-as-draft').addClass('hidden');
            $('.save-as-template').addClass('hidden');
            $('.campaign-continue').addClass('hidden');
            $('.campaign-preview').addClass('hidden');
            if ($('.btn-auto-save').length) {
                campaignManager.autoSave('disabled');
            }
            $('.auto-save').addClass('hidden');
        };
        // Show campaign buttons when campaign is unlocked
        this.showCampaignButtons = function(){
            $('.save-as-draft').removeClass('hidden');
            $('.save-as-template').removeClass('hidden');
            $('.campaign-continue').removeClass('hidden');
            $('.campaign-preview').removeClass('hidden');
            $('.auto-save').removeClass('hidden');
            if ($('.btn-auto-save').is(':checked')) {
                campaignManager.autoSave('enabled');
            }
        };

        // Updaate locking label
        this.updateLockingText = function(text){
           $lockingContainer.find('label span').first().text(text);
        };

        // Return locking status: locked or unlocked
        this.getLockingSatus = function(){
            var $form = Application.utils.getConfigurationForm();

            if( $form.find("#locking").length && $form.find("#locking").data("status") ){
                return $form.find("#locking").data("status");
            }

            return false;
        };

        // Set locking status: locked or unlocked
        this.setLockingStatus = function(status){
            if( status != "locked" && status != "unlocked" ){
                return false;
            }

            var $form = Application.utils.getConfigurationForm();

            if( $form.find("#locking").length ){
                $form.find("#locking").data("status",status);
            }
        };

        // Called after force lock done
        this.onForceLockDone = function(){
            Application.utils.alert.display('', 'This campaign is locked now. Only you can unlock it.', 'success');
            locking.setLockingStatus('locked');
            locking.disableConfigForm();
        };

        this.forceLock = function(fnDone, fnFail) {
            var data = {
                campaign_id: $campaingConfigForm.find("input[name=campaign_id]").val()
            };
            var lockCampaign = Application.utils.doAjax('/campaign/force-lock', {data: data});

            lockCampaign.done(function(data) {
                if(typeof locking.onForceLockDone === 'function'){
                    locking.onForceLockDone();
                }
                if(typeof fnDone === 'function') {
                    fnDone();
                }
            });
            lockCampaign.fail(function(data) {
                Application.utils.alert.display('Error:', 'An error occurred while trying to lock it, please try again later.', 'danger');
                if (typeof fnFail === 'function') {
                    fnFail();
                }
            });
        };

        this.onUnlockForcedDone = function(){
            Application.utils.alert.display('', 'This campaign is unlocked now, and you can make changes on it', 'success');
            locking.setLockingStatus('unlocked');
            locking.enableConfigForm();
        };

        this.unlockForced = function(fnDone, fnFail) {
            var data = {
                campaign_id: $campaingConfigForm.find("input[name=campaign_id]").val()
            };
            var unlockCampaign = Application.utils.doAjax('/campaign/unlock-forced', {data: data});
            unlockCampaign.done(function(data) {
                if(typeof locking.onUnlockForcedDone === 'function'){
                    locking.onUnlockForcedDone();
                }
                if (typeof fnDone === 'function') {
                    fnDone();
                }
            });
            unlockCampaign.fail(function(data) {
                Application.utils.alert.display('Error:', 'An error occurred while trying to unlocked, please try again later.', 'danger');
                if (typeof fnFail === 'function') {
                    fnFail();
                }
            });
        };


        this.disableConfigForm = function(){
            var $form = Application.utils.getConfigurationForm();
            $form.find("input, checkbox, select").attr("disabled","disabled");
        };

        this.enableConfigForm = function(){
            var $form = Application.utils.getConfigurationForm();
            $form.find("input, checkbox, select").removeAttr("disabled");
        };

        return this;
    };
})(jQuery);
