define(function (require, exports, module) {
    var options = {
        page: "#resetPwd"
    };
    var vliveTime = 0;

    function liveTime(time) {
        if (time !== undefined) {
            vliveTime = time;
        }
        var $sendAuthCode = $("#sendAuthCode");
        if (vliveTime > 0) {
            $sendAuthCode.text("再次获取(" + (vliveTime) + ")");
            $sendAuthCode.attr("disabled", "disabled");
            vliveTime--;
        } else {
            $sendAuthCode.text("获取验证码");
            $sendAuthCode.removeAttr("disabled");
            return;
        }
        setTimeout(liveTime, 1000);
    }

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;

        $page.find('#phone').val(getParameter('phone') || localStorage.getItem('phone') || '');
        $page.on('click', '#resetPwdBtn', function () {
            var phone = $("#phone").val();
            var pwd = $("#pwd").val();
            var authCode = $("#authCode").val();

            if (Core.Utils.checkPhone(phone) && Core.Utils.checkPwd(pwd) && Core.Utils.checkAuthCode(authCode)) {
                var newPwd = Core.Utils.getBasePwd(pwd, phone);
                Core.Service.post('buyer/auth/resetPwd', {
                    cel: phone,
                    authCode: authCode,
                    newPwd: newPwd
                }, function (data) {
                    Core.App.alert('密码重置成功，请重新登录', function () {
                        Core.Native.loadPage('login.html?phone=' + phone);
                    })
                })
            }
        }).on('click', '#sendAuthCode', function () {
            var loginName = $('#phone').val();
            var captcha = $('#captcha').val();
            if (Core.Utils.checkPhone(loginName)) {
                liveTime(60);
                Core.Service.post('buyer/auth/sendAuthCode.json', {
                    cel: loginName,
                    captcha: captcha,
                    hasRegister: true
                }, function () {
                    Core.App.alert('成功发送验证码到手机');
                }, function (data) {
                    Core.App.alert(data.message, function () {
                        liveTime(0);
                    });
                });
            }
            return false;
        });

    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");

            initEvent();
        }
    };
});
