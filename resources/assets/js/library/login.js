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

    // validate password input
    $('input[type="password"].validate-password')
        .keyup(function(e) {
            var strength = zxcvbn(e.target.value);
            var score = '0';
            var color = 'red';
            switch (strength.score) {
                case 0: color = 'red'; score = '0'; break;
                case 1: color = 'red'; score = '15'; break;
                case 2: color = 'yellow'; score = '30'; break;
                case 3: color = 'yellow'; score = '50'; break;
                case 4:
                    color = 'yellow';
                    score = '65';
                    var crackTime = String(strength.crack_times_display.offline_slow_hashing_1e4_per_second);
                    if (crackTime.indexOf("years") !=-1) {
                        color = 'green';
                        score = '80';
                    } else if (crackTime.indexOf("centuries") !=-1) {
                        color = 'green';
                        score = '100';
                    }
                    break;
            }
            $('.password-strength-bar').css({'width': score+'%', 'background-color': color}).attr('aria-valuenow', score);
        });
})(jQuery);
