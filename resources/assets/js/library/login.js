(function($){
    $(".login-btn").click(function(){
        var popup = window.open( Application.globals.baseUrl + '/auth/oauth-login', 'login_popup',
            'height=500,width=800,status=0,location=0,toolbar=0,top=50,left=200');

        setTimeout(function () {
            if (!popup || popup.outerHeight === 0){
                main.alert(
                    "Popup Blocker detected. Please add this site to your exceptions list and reload this page.",
                    "error");
            }
        }, 500);
        return false;
    });
})(jQuery);