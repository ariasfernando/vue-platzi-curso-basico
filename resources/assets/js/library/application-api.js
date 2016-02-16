/*
 | ======================
 | API Library
 | Dependencies: jQuery
 | ======================
 */

var Application = Application || {};

Application.api = (function($){

    var options = {
        domSelector: document,
        modalSelector: "#modal-campaign-upload",
        btnUploadSelector: ".btn-upload-api",
        btnModalUploadSelector: ".btn-upload-api",
        uploadApiForm : "#upload-api-form",
        campaignId : "#campaign_id",
        campaignIdData : "campaign-id",
        dataTable : "#uploaded-data"
    };

    this.openUpload = function(elem){
        var _this = this;
        $( options.uploadApiForm ).find( options.campaignId ).val($(elem).data( options.campaignIdData ));
        var $campaignUploadModal = $( options.modalSelector );
        $campaignUploadModal.find('.response-message').html('').removeClass('alert-success').removeClass('alert-danger').hide();
        $campaignUploadModal.find('#filename').val('');
        $campaignUploadModal.find(options.dataTable).hide();
        _this.updateModalTable();
        if( $campaignUploadModal ){
            $campaignUploadModal.modal();
        }
    };

    this.uploadEmail = function(elem){
        var _this = this;
        var $uploadForm = $( options.uploadApiForm );
        $( options.modalSelector ).find('.response-message').html('').removeClass('alert-success').removeClass('alert-danger').hide();
        if( Application.utils.validate.validateForm( $uploadForm[0] ) ){
            $( elem ).addClass("ajax-loader-small").attr("disabled","disabled");
            $( elem ).parent().removeClass("success").addClass("spinner");
            var data = $uploadForm.serialize();
            var processCampaignUpload = Application.utils.doAjax("/api/upload-email", {data: data});
            processCampaignUpload.done(function( response ){
                $('.response-message-success').show();
                _this.updateModalTable();
                $uploadForm.find('#filename').val('');
            });
            processCampaignUpload.fail(function(){
                $('.response-message-error').show();
            });
            processCampaignUpload.always(function(){
                $( elem ).parent().removeClass("spinner");
                $( elem ).removeClass("ajax-loader-small").removeAttr("disabled","disabled");
            });
        }
        return false;
    };

    this.updateModalTable = function(){
        var campaign_id = $( options.modalSelector ).find( options.campaignId ).val();
        var data = { campaign_id: campaign_id };
        var getHistory = Application.utils.doAjax("/api/history", { type: "GET", data: data });
        getHistory.done(function( response ){
            var table = $( options.modalSelector ).find( options.dataTable );
            if (response.length) {
                var tableContent = '';
                var dataInfo = $( options.modalSelector ).find(options.dataTable).data('info') || 'filename';

                for (var i = response.length - 1; i >= 0; i--) {
                    if( i == (response.length - 1)) {
                        for (var key in response[i]) {
                            if ($(options.modalSelector + " #" + key).length && key != 'campaign_id' && response[i][key]) {
                                var fieldContent = (key=='filename')? response[i]['original_filename'] : response[i][key];
                                $(options.modalSelector + " #" + key).val(fieldContent);
                            }
                        }
                    }

                    tableContent += ''
                    + '<tr>'
                    +	'<td>' + response[i].date + '</td>'
                    +	'<td>' + response[i][dataInfo] + '</td>'
                    +	'<td>' + response[i].user + '</td>'
                    + '</tr>';
                }
                table.find('tbody').html(tableContent);
                table.fadeIn();
            }else{
                $(options.modalSelector + " input[type='text']").each(function(){
                   $(this).val('');
                });
                table.hide();
            }
        });
    };

    this.init = function(){
        var _this = this;

        // -- Show upload modal --
        $(document).on("click", options.btnUploadSelector ,function() {
            _this.openUpload( this );
            return false;
        });

        // -- Upload email to api --
        $( options.modalSelector ).on("click", options.btnModalUploadSelector, function(){
            _this.uploadEmail( this );
            return false;
        });

    };

    this.init();

})(jQuery);