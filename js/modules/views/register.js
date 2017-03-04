define(function(require, exports, module) {
    var options = {
        page: "#register"
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
            $sendAuthCode.text("短信验证码");
            $sendAuthCode.removeAttr("disabled");
            return;
        }
        setTimeout(liveTime, 1000);
    }

    function getFormData1(isValid) {
        var formData1 = Core.App.formToJSON('#registerForm1');
        if (isValid) {
            if (!Core.Utils.checkPhone(formData1['loginName'])) {
                Core.App.alert("请输入手机号");
                return null;
            }
            if (!Core.Utils.checkAuthCode(formData1['authCode'])) {
                Core.App.alert("请输入验证码");
                return null;
            }
            if (!formData1['name']) {
                Core.App.alert("请输入昵称");
                return null;
            }
            if (!formData1['pl']) {
                Core.App.alert("请输入密码");
                return null;
            }
            if (!formData1['activeCode']) {
                Core.App.alert("请输入授权码");
                return null;
            }
        }
        return formData1;
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
                    Core.App.alert('成功发送验证码到手机');
                }, function (data) {
                    Core.App.alert(data.message, function () {
                        liveTime(0);
                    });
                });
            }
            return false;
        }).on('click', '.reg', function () {
            var formData1 = getFormData1(true);
            if (!formData1) {
                return false;
            }
            var data = $.extend({}, formData1);
            data['password'] = Core.Utils.getBasePwd(data["pl"], data["loginName"]);
            delete data['pl'];
            Core.Service.post('buyer/auth/register', data, function () {
                Core.App.alert("恭喜你，注册成功", function () {
                    Core.Page.changePage('studyHome.html');
                });
            });
            return false;
        }).on('click', '.activeCodeHelp', function () {
            var helpTip =  '请添加微信：<span style="color: rgb(14,129,167)" class="systemCopy" data-text="zhijianshuo001">zhijianshuo001</span> (点击可复制)获取。';
            Core.App.alert(helpTip);
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
