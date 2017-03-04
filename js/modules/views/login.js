define(function(require, exports, module) {
    var options = {
        page: "#login"
    };

    var wxResponse;
    var vliveTime = 0;

    function liveTime(time) {
        if (time !== undefined) {
            vliveTime = time;
        }
        var $sendAuthCode = $("#send-code");
        if (vliveTime > 0) {
            $sendAuthCode.text("短信验证码(" + (vliveTime) + ")");
            $sendAuthCode.attr("disabled", "disabled");
            vliveTime--;
        } else {
            $sendAuthCode.text("发送验证短信");
            $sendAuthCode.removeAttr("disabled");
            return;
        }
        setTimeout(liveTime, 1000);
    }

    function autoLoginForWeb() {
        var scope = "snsapi_userinfo",
            state = "_" + (+new Date());
        Core.App.showIndicator();
        Wechat.auth(scope, state, function (response) {
            Core.Service.post('buyer/auth/wxLoginWithCode', response, function (data) {
                Core.App.hideIndicator();
                Core.Page.changePage(HomePage);
            }, function (data) {
                Core.App.hideIndicator();
                if(201 === data.code) {
                    wxResponse = response;
                    Core.App.loginScreen('.login-screen');
                } else {
                    Core.App.alert(data.message);
                }
            });
        }, function (reason) {
            Core.App.alert("微信登录失败，失败原因为: " + reason);
            Core.App.hideIndicator();
        });
    }

    // 登录认证
    function login(id) {
        if (id === 'weixin') {
            autoLoginForWeb();
        } else {
            Core.App.alert("无效的登录认证通道！");
        }
    }

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;

        $(document.body).append($('#loginScreen').html());

        $page.on('click', "#loginBtn", function (e) {
            e.preventDefault();
            var username = $("#username").val();
            var password = $("#password").val();
            if (Core.Utils.checkPhone(username) && Core.Utils.checkPwd(password)) {
                Core.Buyer.Login(username, password);
            }
        }).on('click', '.weixinLogin', function (e) {
            login('weixin');
        });

        Core.Native.ready(function () {
            Wechat.isInstalled(function (installed) {
                installed && $('.weixinLogin').removeClass('hide').show();
            }, function (reason) {
                console.info(reason);
            });
        });

        $('.wxBoundCelBtn').click(function () {
            var cel = $('#wxCel').val();
            var authCode = $('#authCode').val();
            var activeCode = $('#activeCode').val();
            if(!Core.Utils.checkPhone(cel) || !Core.Utils.checkAuthCode(authCode)) {
                return;
            }
            if(!activeCode) {
                Core.App.alert('授权码不能为空');
                return;
            }
            var data = $.extend({}, wxResponse, { cel: cel, authCode: authCode, activeCode: activeCode});
            Core.Service.post('buyer/auth/wxRegisterWithCode', data, function () {
                Core.App.closeModal('.wxBoundCel');
                Core.Page.changePage(HomePage);
            });
        });
        $('.send-code').click(function () {
            var loginName = $('#wxCel').val();
            if (Core.Utils.checkPhone(loginName)) {
                liveTime(60);
                Core.Service.post('buyer/auth/sendAuthCode.json', {
                    cel: loginName
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
        $('.activeCodeHelp').click(function () {
            var helpTip =  '请添加微信：<span style="color: rgb(14,129,167)" class="systemCopy" data-text="zhijianshuo001">zhijianshuo001</span> (点击可复制)获取。';
            Core.App.alert(helpTip);
            return false;
        })
    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            var phone = getParameter('phone') || localStorage.getItem('phone');
            if(phone){
                $("#phone").val(phone);
            }
            initEvent();
        }
    };
});
