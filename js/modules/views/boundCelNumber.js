define(function(require, exports, module) {
    var options = {
        page: "#boundCelNumber"
    };
    var vliveTime = 0;

    function liveTime(time) {
        if (time !== undefined) {
            vliveTime = time;
        }
        var $sendAuthCode = $("#sendAuthCode");
        if (vliveTime > 0) {
            $sendAuthCode.text("短信验证码(" + (vliveTime) + ")");
            $sendAuthCode.attr("disabled", "disabled");
            vliveTime--;
        } else {
            $sendAuthCode.text("获取短信验证码");
            $sendAuthCode.removeAttr("disabled");
            return;
        }
        setTimeout(liveTime, 1000);
    }

    function getFormData(isValid) {
        var formData = Core.App.formToJSON('#registerForm1');
        if (isValid) {
            if (!Core.Utils.checkPhone(formData1['loginName']) || !Core.Utils.checkAuthCode(formData1['authCode'])) {
                return null;
            }
        }
        return formData;
    }

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;

        $page.on('click', '#sendAuthCode', function () {
            var loginName = $('#loginName').val();
            if (Core.Utils.checkPhone(loginName)) {
                liveTime(60);
                Core.Service.post('buyer/auth/sendAuthCode.json', {
                    cel: loginName,
                    hasRegister: false
                }, function () {
                }, function () {
                    liveTime(0);
                });
            }
            return false;
        }).on('click', '.reg', function () {
            var formData = getFormData(true);
            if (!formData) {
                return false;
            }
            var data = $.extend({}, formData);
            data['sex'] = 'MALE';
            Core.Service.postFile('buyer/auth/register', data, function () {
                Core.App.alert("绑定手机号成功！", function () {
                    Core.Page.changePage('studyHome.html');
                });
            });
            return false;
        });
    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();

            var phone = getParameter('phone') || localStorage.getItem('phone');
            if(phone){
                $("#phone").val(phone);
            }
        }
    };

});
